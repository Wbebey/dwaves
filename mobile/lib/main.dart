

import 'package:dwaves_mobile/Screen/player.dart';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:dwaves_mobile/Componant/Boutton.dart';
import 'Componant/Boutton.dart';


void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Login_Page(),
    );
  }
}
// check connection wallet flutter 