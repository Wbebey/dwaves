import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dwaves_mobile/Screen/register_page.dart';

var email = 'sofian32@gmail.com';
var password = "12345678";


class Login extends StatelessWidget {
  Login({Key? key, this.token}) : super(key: key);
  final String? token;

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyLoginPage(),
    );
  }
}

class MyLoginPage extends StatefulWidget {
  MyLoginPage({Key? key, this.token}) : super(key: key);
  final String? token;
  @override
  _MyLoginPageState createState() => _MyLoginPageState();
}

class _MyLoginPageState extends State<MyLoginPage> {
  sendLogin() async {
    var url = Uri.parse('http://0.0.0.0:8080/api/v1/auth/login');
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final response =
        await http.post(url, body: {"email": email, "password": password});

    if (response.statusCode == 204) {
      var res = response.headers['set-cookie']!.split(';')[0].split('=')[1];
      prefs.setString('token', res);
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => Manager()));
    } else {
      throw Exception('Failed USER is not created.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Color.fromRGBO(25, 26, 36, 1),
        body: Container(
          height: double.infinity,
          width: double.infinity,
          child: Column(
            children: [
              Container(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                ),
              ),
              const SizedBox(
                height: 30,
              ),
              SizedBox(
                  height: MediaQuery.of(context).size.height * 0.15,
                  width: MediaQuery.of(context).size.height * 0.70,
                  child: Center(
                    child: Text(
                      'Connection',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: const Color.fromRGBO(236, 236, 254, 1),
                          fontSize: MediaQuery.of(context).size.height * 0.05),
                    ),
                  )),
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.05,
                width: MediaQuery.of(context).size.width * 0.70,
                child: TextFormField(
                  style: const TextStyle(
                      color: const Color.fromRGBO(236, 236, 254, 1),
                      fontSize: 20.0),
                  onChanged: (val) {
                    print(val);
                    setState(() => email = val);
                  },
                  validator: (val) => val!.isEmpty ? 'Email manquant' : null,
                  decoration: InputDecoration(
                    enabledBorder: const UnderlineInputBorder(
                      borderSide:
                          BorderSide(color: Color.fromARGB(255, 3, 186, 203)),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide:
                          BorderSide(color: Color.fromARGB(255, 3, 186, 203)),
                    ),
                    labelStyle: TextStyle(
                        color: const Color.fromRGBO(236, 236, 254, 1),
                        fontSize: MediaQuery.of(context).size.height * 0.02),
                    hintText: 'Email',
                    hintStyle: const TextStyle(
                        color: Color.fromRGBO(236, 236, 254, 1)),
                  ),
                ),
              ),
              const SizedBox(
                height: 15,
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height * 0.05,
                width: MediaQuery.of(context).size.width * 0.70,
                child: TextFormField(
                  style: const TextStyle(
                    color: Color.fromRGBO(236, 236, 254, 1),
                    fontSize: 20.0,
                  ),
                  obscureText: true,
                  enableSuggestions: false,
                  autocorrect: false,
                  onChanged: (val) {
                    print(val);

                    setState(() => password = val);
                  },
                  validator: (val) => val!.isEmpty ? 'Password manquant' : null,
                  decoration: InputDecoration(
                    enabledBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.grey),
                    ),
                    focusedBorder: const UnderlineInputBorder(
                      borderSide:
                          BorderSide(color: Color.fromARGB(255, 0, 247, 255)),
                    ),
                    labelStyle: TextStyle(
                        color: const Color.fromRGBO(236, 236, 254, 1),
                        fontSize: MediaQuery.of(context).size.height * 0.020),
                    hintText: 'Mot de passe',
                    hintStyle: const TextStyle(
                        color: Color.fromRGBO(236, 236, 254, 1)),
                  ),
                ),
              ),
              const SizedBox(
                height: 15,
              ),
              GestureDetector(
                onTap: () {
                  sendLogin();
                },
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.05,
                  width: MediaQuery.of(context).size.width * 0.75,
                  decoration: BoxDecoration(
                      color: Color.fromARGB(255, 1, 173, 226),
                      borderRadius: BorderRadius.circular(25)),
                  child: Center(
                    child: Text(
                      'Connection',
                      style: TextStyle(
                          color: Color.fromARGB(255, 255, 255, 255),
                          fontSize: MediaQuery.of(context).size.height * 0.025),
                    ),
                  ),
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => MyregisterPage()));
                },
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.05,
                  width: MediaQuery.of(context).size.width * 0.75,
                  child: Center(
                    child: Text(
                      'Pas de compte ?',
                      style: TextStyle(
                          color: Color.fromARGB(255, 255, 255, 255),
                          fontSize: MediaQuery.of(context).size.height * 0.025),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
