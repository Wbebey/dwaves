import 'dart:convert';

import 'package:audio_video_progress_bar/audio_video_progress_bar.dart';
import 'package:dwaves_mobile/Screen/View_detail_album.dart';
import 'package:flutter/material.dart';
import 'notifiers/play_button_notifier.dart';
import 'notifiers/progress_notifier.dart';
import 'notifiers/repeat_button_notifier.dart';
import 'package:path/path.dart' as Path;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'Pagemanager.dart';

class Manager extends StatefulWidget {
  @override
  _ManagerState createState() => _ManagerState();
}

class _ManagerState extends State<Manager> {
  late final PageManager _pageManager;
  late Future<List<Music>> futureMusic;

  @override
  void initState() {
    _pageManager = PageManager();
    futureMusic = fetchMusics();
  }

  @override
  void dispose() {
    _pageManager.dispose();
    super.dispose();
  }

  Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<List<Music>> fetchMusics() async {
    String? token = await getToken();

    
    MusicFetcher musicFetcher = MusicFetcher();
    final id = musicFetcher.id;
    print("id  est : $id");
    // faire un setter pour id

    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    };

    final response = await http.get(
      Uri.parse('https://dwaves-api.tonfrere.fr/api/v1/albums/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final parsed =
          jsonDecode(response.body)['musics'].cast<Map<String, dynamic>>();
      return parsed.map<Music>((json) => Music.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load musics');
    }
  }

  @override
  Widget build(BuildContext context) {
    WidgetsFlutterBinding.ensureInitialized();
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Color.fromRGBO(25, 26, 36, 1),
          actions: [
            IconButton(
              icon: Icon(Icons.close, color: Colors.red),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
        body: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage("assets/images/Player-Background.png"),
                fit: BoxFit.cover),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(
                height: 50,
              ),
              AudioProgressBar(pageManager: _pageManager),
              Row(
                children: [
                  Column(
                    children: [
                      ImgAlbum(pageManager: _pageManager),
                    ],
                  ),
                  Column(
                    children: const [
                      SizedBox(
                        width: 50,
                      )
                    ],
                  ),
                  Column(
                    children: [CurrentSongTitle(pageManager: _pageManager)],
                  ),
                ],
              ),
              AudioControlButtons(pageManager: _pageManager),
            ],
          ),
        ),
      ),
    );
  }
}

class CurrentSongTitle extends StatelessWidget {
  final PageManager pageManager;

  CurrentSongTitle({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String>(
      valueListenable: pageManager.currentSongTitleNotifier,
      builder: (_, title, __) {
        return const Padding(
          padding: const EdgeInsets.only(right: 20),
          child: Text(
            "n/a",
            textAlign: TextAlign.right,
            style: TextStyle(
              color: Colors.black,
              fontSize: 34,
            ),
          ),
        );
      },
    );
  }
}

//class CurrentTitle extends StatelessWidget {
//   CurrentTitle({Key? key}) : super(key: key);
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//       child: FutureBuilder<List<Music>>(
//         builder: (context, snapshot) {
//           if (snapshot.hasData) {
//             return ListView.builder(
//               padding: const EdgeInsets.only(right: 20),
//               itemCount: snapshot.data!.length,
//               itemBuilder: (context, index) {
//                 final music = snapshot.data![index];
//                 return const ListTile(
//                   title:  Text("dzd",
//                     textAlign: TextAlign.right,
//                     style: TextStyle(
//                     color: Colors.black,
//                     fontSize: 34,
//                   )),
//                 );
//               },
//             );
//           } else if (snapshot.hasError) {
//             return Text("${snapshot.error}");
//           }
//           return CircularProgressIndicator();
//         },
//       ),
//     ));
//   }
// }

// add img album
class ImgAlbum extends StatelessWidget {
  final PageManager pageManager;

  ImgAlbum({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String>(
      valueListenable: pageManager.currentSongTitleNotifier,
      builder: (_, title, __) {
        return Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Image.asset(
              "assets/images/Iconsax/Linear/_DesignPictureAlbumSmall.png",
              width: 200,
              height: 200),
        );
      },
    );
  }
}

class AudioProgressBar extends StatelessWidget {
  final PageManager pageManager;

  AudioProgressBar({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ProgressBarState>(
      valueListenable: pageManager.progressNotifier,
      builder: (_, value, __) {
        return ProgressBar(
          progress: value.current,
          buffered: value.buffered,
          total: value.total,
          onSeek: pageManager.seek,
        );
      },
    );
  }
}

class AudioControlButtons extends StatelessWidget {
  final PageManager pageManager;

  AudioControlButtons({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          RepeatButton(
            pageManager: pageManager,
          ),
          PreviousSongButton(
            pageManager: pageManager,
          ),
          PlayButton(
            pageManager: pageManager,
          ),
          NextSongButton(
            pageManager: pageManager,
          ),
          ShuffleButton(
            pageManager: pageManager,
          ),
        ],
      ),
    );
  }
}

class RepeatButton extends StatelessWidget {
  final PageManager pageManager;

  RepeatButton({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<RepeatState>(
      valueListenable: pageManager.repeatButtonNotifier,
      builder: (context, value, child) {
        Icon icon;
        switch (value) {
          case RepeatState.off:
            icon = const Icon(Icons.repeat, color: Colors.grey);
            break;
          case RepeatState.repeatSong:
            icon = const Icon(Icons.repeat_one);
            break;
          case RepeatState.repeatPlaylist:
            icon = const Icon(Icons.repeat);
            break;
        }
        return IconButton(
          icon: icon,
          onPressed: pageManager.onRepeatButtonPressed,
        );
      },
    );
  }
}

class PreviousSongButton extends StatelessWidget {
  final PageManager pageManager;

  PreviousSongButton({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: pageManager.isFirstSongNotifier,
      builder: (_, isFirst, __) {
        return IconButton(
          icon: const Icon(Icons.skip_previous),
          onPressed: (isFirst) ? null : pageManager.onPreviousSongButtonPressed,
        );
      },
    );
  }
}

class PlayButton extends StatelessWidget {
  final PageManager pageManager;

  PlayButton({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ButtonState>(
      valueListenable: pageManager.playButtonNotifier,
      builder: (_, value, __) {
        switch (value) {
          case ButtonState.loading:
            return Container(
              margin: const EdgeInsets.all(8.0),
              width: 32.0,
              height: 32.0,
              child: const CircularProgressIndicator(),
            );
          case ButtonState.paused:
            return IconButton(
              icon: const Icon(Icons.play_arrow),
              iconSize: 32.0,
              onPressed: pageManager.play,
            );
          case ButtonState.playing:
            return IconButton(
              icon: const Icon(Icons.pause),
              iconSize: 32.0,
              onPressed: pageManager.pause,
            );
        }
      },
    );
  }
}

class NextSongButton extends StatelessWidget {
  final PageManager pageManager;

  NextSongButton({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: pageManager.isLastSongNotifier,
      builder: (_, isLast, __) {
        return IconButton(
          icon: const Icon(Icons.skip_next),
          onPressed: (isLast) ? null : pageManager.onNextSongButtonPressed,
        );
      },
    );
  }
}

class ShuffleButton extends StatelessWidget {
  final PageManager pageManager;

  ShuffleButton({required this.pageManager, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: pageManager.isShuffleModeEnabledNotifier,
      builder: (context, isEnabled, child) {
        return IconButton(
          icon: (isEnabled)
              ? const Icon(Icons.shuffle)
              : const Icon(Icons.shuffle, color: Colors.grey),
          onPressed: pageManager.onShuffleButtonPressed,
        );
      },
    );
  }
}
