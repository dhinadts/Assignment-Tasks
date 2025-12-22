class User {
  User({
    required this.id,
    required this.username,
    required this.name,
    required this.avatarUrl,
    required this.profileUrl,
    required this.bio,
    required this.followers,
    required this.following,
  });

  final int? id;
  final String? username;
  final String? name;
  final String? avatarUrl;
  final String? profileUrl;
  final String? bio;
  final int? followers;
  final int? following;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["id"],
      username: json["username"],
      name: json["name"],
      avatarUrl: json["avatar_url"],
      profileUrl: json["profile_url"],
      bio: json["bio"],
      followers: json["followers"],
      following: json["following"],
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "username": username,
    "name": name,
    "avatar_url": avatarUrl,
    "profile_url": profileUrl,
    "bio": bio,
    "followers": followers,
    "following": following,
  };
}
