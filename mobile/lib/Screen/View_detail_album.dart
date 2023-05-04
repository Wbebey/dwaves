import 'dart:io';
import 'package:dwaves_mobile/Screen/View_Album.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:just_audio/just_audio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'Pagemanager.dart';

import 'manager.dart';
import 'notifiers/play_button_notifier.dart';

class Music extends StatefulWidget {
  const Music({Key? key, required this.name, required this.src})
      : super(key: key);
  final String name;
  final String src;

  factory Music.fromJson(Map<String, dynamic> json) {
    return Music(
      name: json['name'],
      src: json['src'],
    );
  }

  @override
  _ViewMusicState createState() => _ViewMusicState();
}

class MusicFetcher {
  int _id = 3;

  int get id => _id;

  set id(int value) {
    _id = value;
  }
}

class _ViewMusicState extends State<Music> {
  late Future<List<Music>> futureMusic;
  late BuildContext _context;

  @override
  void initState() {
    super.initState();
    futureMusic = fetchMusics();
    _context = context;
  }

  Future<String?> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<List<Music>> fetchMusics() async {
    String? token = await getToken();

    final id = ModalRoute.of(context)!.settings.arguments as int;
    print("id : $id");
    // faire un setter pour id

    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    };

    final response = await http.get(
      Uri.parse('https://dwaves-api.tonfrere.fr/api/v1/albums/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final parsed =
          jsonDecode(response.body)['musics'].cast<Map<String, dynamic>>();
      return parsed.map<Music>((json) => Music.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load musics');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(),
      body: Center(
        child: FutureBuilder<List<Music>>(
          future: futureMusic,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  final music = snapshot.data![index];
                  return ListTile(
                    title: Text(music.name),
                    subtitle: Text('${music.src} listenings'),
                    onTap: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (context) => Manager()                    )
                        
                          );
                    },
                  );
                },
              );
            } else if (snapshot.hasError) {
              return Text("${snapshot.error}");
            }
            return CircularProgressIndicator();
          },
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          children: const [
            Expanded(
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Text('Now Playing'),
              ),
            ),
            IconButton(
              icon: Icon(Icons.close),
              onPressed: null,
            ),
          ],
        ),
      ),
    );
  }
}

class MyAppBar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      title: Row(
        children: const [
          SizedBox(width: 16),
          Text('Album', style: TextStyle(color: Colors.black)),
        ],
      ),
      actions: [
        const Padding(
          padding: EdgeInsets.only(right: 8.0),
          child: VerticalDivider(
            color: Colors.black,
            thickness: 1,
            width: 16,
            indent: 8,
            endIndent: 8,
          ),
        ),
        IconButton(
          icon: Icon(Icons.close, color: Colors.red),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
