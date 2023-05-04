import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:clipboard/clipboard.dart';
import 'package:walletconnect_dart/walletconnect_dart.dart';
import 'package:url_launcher/url_launcher_string.dart';



import '../Screen/Player.dart';


// ignore: camel_case_types
class Login_Page extends StatefulWidget {
  // ignore: prefer_const_constructors_in_immutables
  const Login_Page({ Key? key }) : super(key: key);

  @override
  State<Login_Page> createState() => _Login_PageState();
}

// ignore: camel_case_types
class _Login_PageState extends State<Login_Page> {
    var connector = WalletConnect(
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: const PeerMeta(
          name: 'My App',
          description: 'An app for converting pictures to NFT',
          url: 'https://walletconnect.org',
          icons: [
            'https://files.gitbook.com/v0/b/gitbook-legacy-files/o/spaces%2F-LJJeCjcLrr53DcT1Ml7%2Favatar.png?alt=media'
          ]));

  var _session, _uri;

  loginUsingMetamask(BuildContext context) async {
    if (!connector.connected) {
      try {
        var session = await connector.createSession(onDisplayUri: (uri) async {
          _uri = uri;
          await launchUrlString(uri, mode: LaunchMode.externalApplication);
        });
        setState(() {
          _session = session;
        });
      } catch (exp) {
        print(exp);
      }
    }
  }


    @override
    Widget build(BuildContext context) {
      return Scaffold(
        body: Stack(
          children: [
            Row(
              mainAxisAlignment : MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.max,
              children: [
                Container(
                  padding: const EdgeInsets.only(top: 200),
                  child: Image.asset(
                    'assets/images/MetaMask_Fox.png',
                    width: 200,
                    height: 150,
                  ),
                )
              ],
            ),
            Row(
              mainAxisAlignment : MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.max,
              children: [
                Container(
                  padding: const EdgeInsets.only(top: 375),
                  child: const Text('Connect to MetaMask',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            Row(
              mainAxisAlignment : MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.max,
              children: [
                Container(
                  padding: const EdgeInsets.only(top: 450),
                  child: ElevatedButton(
                    onPressed: () => loginUsingMetamask(context),
                    child: const Text('Connect'),
                    style: ElevatedButton.styleFrom(
                      primary: Colors.green,
                      onPrimary: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    ),
                  ),
                ),
              ],
            ),
            // Row(
            //   mainAxisAlignment : MainAxisAlignment.center,
            //   mainAxisSize: MainAxisSize.max,
            //   children: [
            //     Container(
            //       padding: const EdgeInsets.only(bottom: 250),
            //       child: IconButton(
            //           onPressed: () {
            //         FlutterClipboard.copy('0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf').then(( value ) => print('copied'));
            //       },
            //       icon: const Icon(Icons.content_copy_rounded),
            //       color: Colors.white60, 
            //     ),
            //     ),
            //     const Text(
            //       'Copy Address',
            //       style: TextStyle(
            //         color: Colors.black38,
            //       ),
            //     ),
            //   ],
            // )
            Row(

            )
          ],
        ),
      );
    }
    void _showSnackbar() {
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text("Text Copied")));
  }
    void _copytext(String copytext) {
    FlutterClipboard.copy(copytext).then((value) => _showSnackbar());
  }   
  }




