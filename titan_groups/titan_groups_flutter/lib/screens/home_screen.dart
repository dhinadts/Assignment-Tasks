import 'package:flutter/material.dart';
import 'package:titan_groups_flutter/screens/user_card.dart';
import '../services/api_service.dart';
import '../models/user.dart';

class HomeScreen extends StatelessWidget {
  final ApiService apiService = ApiService();

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(title: Text("Users List")),
      body: FutureBuilder<List<User>>(
        future: apiService.fetchItems(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error loading data"));
          } else {
            final users = snapshot.data!;
            return width < 600
                ? ListView.builder(
                    itemCount: users.length,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemBuilder: (context, index) {
                      final user = users[index];

                      return Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        elevation: 3,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),

                          // Avatar
                          leading: CircleAvatar(
                            radius: 28,
                            backgroundImage: NetworkImage(user.avatarUrl ?? ''),
                          ),

                          // Name + Username + Bio
                          title: Text(
                            user.name ?? '',
                            style: Theme.of(context).textTheme.titleMedium
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),

                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),

                              Text(
                                "@${user.username}",
                                style: TextStyle(
                                  color: Colors.blueGrey[600],
                                  fontSize: 13,
                                ),
                              ),

                              const SizedBox(height: 6),

                              Text(
                                user.bio ?? '',
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(color: Colors.grey[700]),
                              ),

                              const SizedBox(height: 10),

                              // Followers row
                              Row(
                                children: [
                                  _statChip(
                                    Icons.people,
                                    "${user.followers} followers",
                                  ),
                                  const SizedBox(width: 8),
                                  _statChip(
                                    Icons.person_add,
                                    "${user.following} following",
                                  ),
                                ],
                              ),
                            ],
                          ),

                          // Trailing icon
                          trailing: const Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 16,
                          ),

                          onTap: () {
                            // Optional: open profile or navigate
                          },
                        ),
                      );
                    },
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 3,
                          mainAxisSpacing: 16,
                          crossAxisSpacing: 16,
                          childAspectRatio: 3,
                        ),
                    itemCount: users.length,
                    itemBuilder: (context, index) =>
                        UserCard(user: users[index]),
                  );
          }
        },
      ),
    );
  }

  Widget _statChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blueGrey.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.blueGrey),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}
