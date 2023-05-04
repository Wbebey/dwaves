import 'dart:convert';

import 'package:dwaves_mobile/Screen/View_Album.dart';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'View_detail_album.dart';
import 'notifiers/play_button_notifier.dart';
import 'notifiers/progress_notifier.dart';
import 'notifiers/repeat_button_notifier.dart';

class MusicTrack {
  final String src;

  MusicTrack({required this.src});

  factory MusicTrack.fromJson(Map<String, dynamic> json) {
    return MusicTrack(
      src: json['src'],
    );
  }
}

class PageManager {
  final currentSongTitleNotifier = ValueNotifier<String>('');
  final playlistNotifier = ValueNotifier<List<String>>([]);
  final progressNotifier = ProgressNotifier();
  final repeatButtonNotifier = RepeatButtonNotifier();
  final isFirstSongNotifier = ValueNotifier<bool>(true);
  final playButtonNotifier = PlayButtonNotifier();
  final isLastSongNotifier = ValueNotifier<bool>(true);
  final isShuffleModeEnabledNotifier = ValueNotifier<bool>(false);

  late AudioPlayer _audioPlayer;
  late ConcatenatingAudioSource _playlist;

  PageManager() {
    _init();
  }

  AudioPlayer get audioPlayer => _audioPlayer;

  void _init() async {
    _audioPlayer = AudioPlayer();
    _setInitialPlaylist();
    _listenForChangesInPlayerState();
    _listenForChangesInPlayerPosition();
    _listenForChangesInBufferedPosition();
    _listenForChangesInTotalDuration();
    _listenForChangesInSequenceState();

  }

  Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<List<MusicTrack>> fetchMusicTracks() async {
    String? token = await getToken();
    MusicFetcher musicFetcher = MusicFetcher();
    final id = musicFetcher.id;
    print(id);
    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    };

    final response = await http.get(
      Uri.parse('http://localhost:8080/api/v1/albums/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      // List<dynamic> body = jsonDecode(response.body)["musics"][0];
      final musicData = jsonDecode(response.body)["musics"] as List<dynamic>;
      //final src = musicData["src"] as String;

      List<MusicTrack> musicTracks = musicData
          .map(
            (dynamic item) => MusicTrack.fromJson(item),
          )
          .toList();
      return musicTracks;
    } else {
      throw Exception('Failed to load music tracks');
    }
  }

void _setInitialPlaylist() async {
  final songs = await fetchMusicTracks();
  List<Uri> maListe = [];
  for (var i = 0; i < songs.length; i++) {
    maListe.add(Uri.parse(songs[i].src));
  }

  List<AudioSource> audioSources = maListe.map((uri) {
    return AudioSource.uri(uri);
  }).toList();

  _playlist = ConcatenatingAudioSource(children: audioSources);

  await _audioPlayer.setAudioSource(_playlist);


}


  void _listenForChangesInPlayerState() {
    _audioPlayer.playerStateStream.listen((playerState) {
      final isPlaying = playerState.playing;
      final processingState = playerState.processingState;
      if (processingState == ProcessingState.loading ||
          processingState == ProcessingState.buffering) {
        playButtonNotifier.value = ButtonState.loading;
      } else if (!isPlaying) {
        playButtonNotifier.value = ButtonState.paused;
      } else if (processingState != ProcessingState.completed) {
        playButtonNotifier.value = ButtonState.playing;
      } else {
        _audioPlayer.seek(Duration.zero);
        _audioPlayer.pause();
      }
    });
  }

  void _listenForChangesInPlayerPosition() {
    _audioPlayer.positionStream.listen((position) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: position,
        buffered: oldState.buffered,
        total: oldState.total,
      );
    });
  }

  void _listenForChangesInBufferedPosition() {
    _audioPlayer.bufferedPositionStream.listen((bufferedPosition) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: oldState.current,
        buffered: bufferedPosition,
        total: oldState.total,
      );
    });
  }

  void _listenForChangesInTotalDuration() {
    _audioPlayer.durationStream.listen((totalDuration) {
      final oldState = progressNotifier.value;
      progressNotifier.value = ProgressBarState(
        current: oldState.current,
        buffered: oldState.buffered,
        total: totalDuration ?? Duration.zero,
      );
    });
  }

  void _listenForChangesInSequenceState() {
    _audioPlayer.sequenceStateStream.listen((sequenceState) {
      if (sequenceState == null) return;

      // update current song title
      final currentItem = sequenceState.currentSource;
      final title = currentItem?.tag as String?;
      currentSongTitleNotifier.value = title ?? '';

      // update playlist
      final playlist = sequenceState.effectiveSequence;
      final titles = playlist.map((item) => item.tag as String).toList();
      playlistNotifier.value = titles;

      // update shuffle mode
      isShuffleModeEnabledNotifier.value = sequenceState.shuffleModeEnabled;

      // update previous and next buttons
      if (playlist.isEmpty || currentItem == null) {
        isFirstSongNotifier.value = true;
        isLastSongNotifier.value = true;
      } else {
        isFirstSongNotifier.value = playlist.first == currentItem;
        isLastSongNotifier.value = playlist.last == currentItem;
      }
    });
  }

  void play() async {
    _audioPlayer.play();
  }

  void pause() {
    _audioPlayer.pause();
  }

  void seek(Duration position) {
    _audioPlayer.seek(position);
  }

  void dispose() {
    _audioPlayer.dispose();
  }

  void onRepeatButtonPressed() {
    repeatButtonNotifier.nextState();
    switch (repeatButtonNotifier.value) {
      case RepeatState.off:
        _audioPlayer.setLoopMode(LoopMode.off);
        break;
      case RepeatState.repeatSong:
        _audioPlayer.setLoopMode(LoopMode.one);
        break;
      case RepeatState.repeatPlaylist:
        _audioPlayer.setLoopMode(LoopMode.all);
    }
  }

  void onPreviousSongButtonPressed() {
    _audioPlayer.seekToPrevious();
  }

  void onNextSongButtonPressed() {
    _audioPlayer.seekToNext();
  }

  void onShuffleButtonPressed() async {
    final enable = !_audioPlayer.shuffleModeEnabled;
    if (enable) {
      await _audioPlayer.shuffle();
    }
    await _audioPlayer.setShuffleModeEnabled(enable);
  }

  void addSong() {
    final songNumber = _playlist.length + 1;
    const prefix = 'https://www.soundhelix.com/examples/mp3';
    final song = Uri.parse('$prefix/SoundHelix-Song-$songNumber.mp3');
    _playlist.add(AudioSource.uri(song, tag: 'Song $songNumber'));
  }

  void removeSong() {
    final index = _playlist.length - 1;
    if (index < 0) return;
    _playlist.removeAt(index);
  }
}
