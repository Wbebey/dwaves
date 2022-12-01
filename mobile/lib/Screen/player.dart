// import 'package:flutter/material.dart';
// import 'package:just_audio/just_audio.dart';

// class Playermusictest extends StatefulWidget {
//   const Playermusictest(AudioPlayer audioPlayer, {Key? key}) : super(key: key);

//   @override
//   State<Playermusictest> createState() => _PlayermusicState();
// }

// class _PlayermusicState extends State<Playermusictest> {
//   late AudioPlayer _audioPlayer;

//   @override
//   void initState() {
//     super.initState();
//     _audioPlayer = AudioPlayer();
//   }

//   void dispose() {
//     _audioPlayer.dispose();
//     super.dispose();
//   }

//   Widget build(BuildContext? context) {
//     return Row(
//       mainAxisAlignment: MainAxisAlignment.center,
//       children: [
//         IconButton(
//           onPressed: () {
//             _audioPlayer.play();
//           },
//           icon: const Icon(Icons.play_arrow),
//         ),
//         // StreamBuilder<PlayerState>(
//         //   stream: _audioPlayer.playerStateStream,
//         //   builder: (_, snapshot) {
//         //     final playerState = snapshot.data;
//         //     return _playPauseButton(playerState!);
//         //   },
//         // ),
//       ],
//     );
//   }

//   Widget _playPauseButton(PlayerState playerState) {
//     final processingState = playerState.processingState;
//     if (processingState == ProcessingState.loading ||
//         processingState == ProcessingState.buffering) {
//       return Container(
//         margin: EdgeInsets.all(8.0),
//         width: 64.0,
//         height: 64.0,
//         child: CircularProgressIndicator(),
//       );
//     } else if (_audioPlayer.playing != true) {
//       return IconButton(
//         icon: Icon(Icons.play_arrow),
//         iconSize: 64.0,
//         onPressed: _audioPlayer.play,
//       );
//     } else if (processingState != ProcessingState.completed) {
//       return IconButton(
//         icon: Icon(Icons.pause),
//         iconSize: 64.0,
//         onPressed: _audioPlayer.pause,
//       );
//     } else {
//       return IconButton(
//         icon: Icon(Icons.replay),
//         iconSize: 64.0,
//         onPressed: () => _audioPlayer.seek(Duration.zero,
//             index: _audioPlayer.effectiveIndices!.first),
//       );
//     }
//   }
// }
