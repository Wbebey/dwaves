
import 'package:dwaves_mobile/Screen/Login_page.dart';
import 'package:dwaves_mobile/Screen/register_page.dart';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:dwaves_mobile/Componant/Boutton.dart';
import 'Componant/Boutton.dart';
import 'package:flutter/services.dart';
import 'package:dwaves_mobile/Screen/manager.dart';



void main() {
  runApp(MyApp());
}


class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);
  String? cookies;
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: cookies == null ?  MyregisterPage() : Manager(),
    );
  }
}
