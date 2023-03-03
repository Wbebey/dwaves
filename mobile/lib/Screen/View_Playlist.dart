import 'package:dwaves_mobile/Screen/manager.dart';
import 'package:dwaves_mobile/Screen/manager.dart';
import 'package:dwaves_mobile/Screen/playlist.dart';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'Pagemanager.dart';
import 'manager.dart';
import 'manager.dart';
import 'notifiers/play_button_notifier.dart';

// affiche moi les musiques de la playlist de PageManager
class ViewPlaylist extends StatefulWidget {
  const ViewPlaylist({Key? key}) : super(key: key);

  @override
  _ViewPlaylistState createState() => _ViewPlaylistState();
}

class _ViewPlaylistState extends State<ViewPlaylist> {
  late final PageManager _pageManager;
  late final AudioPlayer _player;
  late final Manager _manager;
  

  @override
  void initState() {
    super.initState();
    _pageManager = PageManager();
    _player = AudioPlayer();
    _manager = Manager();
  }

  @override
  void dispose() {
    _pageManager.dispose();
    _player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: MyAppBar(),
      body: ListView.builder(
        itemCount: _pageManager.playlistNotifier.value.length,
        itemBuilder: (context, index) {
          final item = _pageManager.playlistNotifier.value[index];
          return new ListTile(
            title: Text(item),
            subtitle: Text(item),
            onTap: () async {
              await _player.setUrl(item);
              await _player.play();
            },
          );
        },
      ),
// rajoute un petit player a la fin de la page tout en bas et un bouton pour fermer la page
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
          Text('Playlist', style: TextStyle(color: Colors.black)),
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
