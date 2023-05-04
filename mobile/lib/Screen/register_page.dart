import 'dart:convert';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as Path;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dwaves_mobile/Screen/Login_page.dart';


var username = '';
var email = '';
var password = "";
var password_confirmation = "";

class register extends StatelessWidget {
  register({Key? key, this.cookies}) : super(key: key);
  final String? cookies;

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyregisterPage(),
    );
  }
}

class MyregisterPage extends StatefulWidget {
  MyregisterPage({Key? key, this.cookies}) : super(key: key);
  final String? cookies;
  @override
  _MyregisterPageState createState() => _MyregisterPageState();
}

class _MyregisterPageState extends State<MyregisterPage> {
  void sendRegister() async {
    var url = Uri.parse('https://dwaves-api.tonfrere.fr/api/v1/auth/register');
    SharedPreferences prefs = await SharedPreferences.getInstance();
    final response =
        await http.post(url, body: {
          "username": username,
          "email": email,
          "password": password,
          "passwordConfirmation": password_confirmation
        });

    if (response.statusCode == 201) {
      prefs.setString('cookies', response.body);
      Navigator.push(context, MaterialPageRoute(builder: (context) => Manager()));
    
    } else {
      print(response.statusCode);
      throw Exception('Failed to create USER.');
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
                      'Incription',
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
                  validator: (val) => val!.isEmpty ? 'Username manquant' : null,
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
                    hintText: 'Username',
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
                    setState(() => password_confirmation = val);
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
                    hintText: 'Confirme ton Mot de passe',
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
                  if(password == password_confirmation){
                    sendRegister();
                  }
                  
                },
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.05,
                  width: MediaQuery.of(context).size.width * 0.75,
                  decoration: BoxDecoration(
                      color: Color.fromARGB(255, 1, 173, 226),
                      borderRadius: BorderRadius.circular(25)),
                  child: Center(
                    child: Text(
                      'Inscris-toi',
                      style: TextStyle(
                          color: Color.fromARGB(255, 255, 255, 255),
                          fontSize: MediaQuery.of(context).size.height * 0.025),
                    ),
                  ),
                ),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.push(context,
                  MaterialPageRoute(builder: (context) => MyLoginPage()));
                },
                child: Container(
                  height: MediaQuery.of(context).size.height * 0.05,
                  width: MediaQuery.of(context).size.width * 0.75,
                  child: Center(
                    child: Text(
                      'Déjà un compte ?',
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