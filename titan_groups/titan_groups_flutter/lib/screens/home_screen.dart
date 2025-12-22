import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user.dart';

class HomeScreen extends StatelessWidget {
  final ApiService apiService = ApiService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Items List")),
      body: FutureBuilder<List<User>>(
        future: apiService.fetchItems(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error loading data"));
          } else {
            final items = snapshot.data!;
            return ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(items[index].name ?? ''),
                  subtitle: Text(items[index].bio ?? ''),
                );
              },
            );
          }
        },
      ),
    );
  }
}
