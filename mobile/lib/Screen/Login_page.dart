import 'dart:convert';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as Path;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

String email = '';
String password = '';
bool choix1 = false;
bool choix2 = false;
bool choix3 = false;

class MyLoginPage extends StatefulWidget {
  const MyLoginPage({Key? key});
  @override
  _MyLoginPageState createState() => _MyLoginPageState();
}

class _MyLoginPageState extends State<MyLoginPage> {
  void sendLogin() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final response = await http.post(
        Uri.parse('http://localhost:8080/api/v1/auth/login'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'password': password,
        }));
    if (response.statusCode == 200) {
      print(json.decode(response.body)['token']);
      await prefs.setString('jwt', json.decode(response.body)['token']);
    } else {
      print(response.statusCode);
      throw Exception('Failed to create USER.');
    }
  }

  @override
  
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text("test")
            ]
          ),
        ),
      ),
    );
  }

}
