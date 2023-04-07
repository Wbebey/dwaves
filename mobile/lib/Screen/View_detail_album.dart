// import 'dart:io';

// import 'package:dwaves_mobile/Componant/Boutton.dart';
// import 'package:dwaves_mobile/Screen/Login_page.dart';
// import 'package:dwaves_mobile/Screen/manager.dart';
// import 'package:dwaves_mobile/Screen/manager.dart';
// import 'package:dwaves_mobile/Screen/playlist.dart';
// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'dart:convert';
// import 'package:just_audio/just_audio.dart';
// import 'package:shared_preferences/shared_preferences.dart';
// import 'Pagemanager.dart';
// import 'View_Album.dart';
// import 'manager.dart';
// import 'notifiers/play_button_notifier.dart';

// // affiche moi les musiques de la playlist de PageManager
// class Detail_Album extends StatefulWidget {
//   const Detail_Album({
//     Key? key,
//     required this.type,
//     required this.name,
//     required this.genre,
//     required this.artist,
//     required this.id,
//   }) : super(key: key);
//   final int id;
//   final String name;
//   final String type;
//   final String genre;
//   final String artist;

//   factory Detail_Album.fromJson(Map<String, dynamic> json) {
//     return Detail_Album(
//       id: json['id'],
//       name: json['name'],
//       type: json['type'],
//       genre: json['genre'],
//       artist: json['artist'],
//     );
//   }

//   @override
//   _ViewDetail_AlbumState createState() => _ViewDetail_AlbumState();
// }

// class _ViewDetail_AlbumState extends State<Detail_Album> {
//   late final PageManager _pageManager;
//   late final AudioPlayer _player;
//   late final Manager _manager;
//   late Future<List<Album>> futureAlbums;

//   @override
//   void initState() {
//     super.initState();
//     _pageManager = PageManager();
//     _player = AudioPlayer();
//     _manager = Manager();
//     super.initState();
//     futureAlbums = fetchAlbums() as Future<List<Album>>;
//   }

//   @override
//   void dispose() {
//     _pageManager.dispose();
//     _player.dispose();
//     super.dispose();
//   }

//   Future<String?> getToken() async {
//     SharedPreferences prefs = await SharedPreferences.getInstance();
//     return prefs.getString('token');
//   }

//   Future<List<Detail_Album>> fetchAlbums() async {
//     String? token = await getToken();
//     int id = widget.id;

//     final headers = {
//       'Authorization': 'Bearer $token',
//       'Content-Type': 'application/json'
//     };

//     final response = await http.get(
//       Uri.parse('http://localhost:8080/api/v1/albums/$id'),
//       headers: headers,
//     );
//     if (response.statusCode == 200) {
//       List<dynamic> data = json.decode(response.body);
      
//     } else {
//       throw Exception('Failed to load albums');
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: MyAppBar(),
//       body: Center(
//         child: FutureBuilder<List<Album>>(
//           future: futureAlbums,
//           builder: (context, snapshot) {
//             if (snapshot.hasData) {
//               return ListView.builder(
//                 itemCount: snapshot.data!.length,
//                 itemBuilder: (context, index) {
//                   return ListTile(
//                     title: Text(snapshot.data![index].name),
//                     subtitle: Text(snapshot.data![index].artist),
                    
//                   );
//                 },
//               );
//             } else if (snapshot.hasError) {
//               return Text('${snapshot.error}');
//             }

//             // By default, show a loading spinner.
//             return const CircularProgressIndicator();
//           },
//         ),


//       ),
// // rajoute un petit player a la fin de la page tout en bas et un bouton pour fermer la page
//       bottomNavigationBar: BottomAppBar(
//         child: Row(
//           children: const [
//             Expanded(
//               child: Padding(
//                 padding: EdgeInsets.all(8.0),
//                 child: Text('Now Playing'),
//               ),
//             ),
//             IconButton(
//               icon: Icon(Icons.close),
//               onPressed: null,
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }



// class MyAppBar extends StatelessWidget implements PreferredSizeWidget {
//   @override
//   Widget build(BuildContext context) {
//     return AppBar(
//       backgroundColor: Colors.white,
//       title: Row(
//         children: const [
//           SizedBox(width: 16),
//           Text('Album', style: TextStyle(color: Colors.black)),
//         ],
//       ),
//       actions: [
//         const Padding(
//           padding: EdgeInsets.only(right: 8.0),
//           child: VerticalDivider(
//             color: Colors.black,
//             thickness: 1,
//             width: 16,
//             indent: 8,
//             endIndent: 8,
//           ),
//         ),
//         IconButton(
//           icon: Icon(Icons.close, color: Colors.red),
//           onPressed: () {
//             Navigator.pop(context);
//           },
//         ),
//       ],
//     );
//   }

//   @override
//   Size get preferredSize => Size.fromHeight(kToolbarHeight);
// }
