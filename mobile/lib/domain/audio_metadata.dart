/// Represents information about an audio source.
class AudioMetadata {
  /// The name of the song/show/recording.
  final String title;

  /// URL to an image representing this audio source.
  final String artwork;

  AudioMetadata({required this.title, required this.artwork});
}
