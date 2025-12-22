import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/item.dart';

class ApiService {
  static const String apiUrl =
      "https://titan-groups.onrender.com/php-api/items.php";

  Future<List<Item>> fetchItems() async {
    final response = await http.get(Uri.parse(apiUrl));
    if (response.statusCode == 200) {
      final body = json.decode(response.body);
      List list = body['data'];
      return list.map((e) => Item.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load data");
    }
  }
}
