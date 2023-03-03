
import 'package:dwaves_mobile/Screen/Login_page.dart';
import 'package:dwaves_mobile/Screen/register_page.dart';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:dwaves_mobile/Componant/Boutton.dart';
import 'Componant/Boutton.dart';
import 'package:flutter/services.dart';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'Screen/View_Playlist.dart';



void main() {
  runApp(MyApp());
}


class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);
  String? token;
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: ViewPlaylist(),
    );
  }
}

