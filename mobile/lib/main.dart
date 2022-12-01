
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:dwaves_mobile/Componant/Boutton.dart';
import 'Componant/Boutton.dart';

import 'package:dwaves_mobile/Screen/manager.dart';



void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
    
      home: Manager(),
    );
  }
}

// check connection wallet flutter 