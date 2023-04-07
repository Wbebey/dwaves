import 'package:dwaves_mobile/Screen/Login_page.dart';
import 'package:dwaves_mobile/Screen/register_page.dart';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:dwaves_mobile/Componant/Boutton.dart';
import 'Componant/Boutton.dart';
import 'package:flutter/services.dart';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'Screen/View_Album.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

Future<String?> getToken() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString('token');
}

class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);
  final String? token = getToken().toString();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: token != null ? MyLoginPage() : Manager(),
    );
  }
}
