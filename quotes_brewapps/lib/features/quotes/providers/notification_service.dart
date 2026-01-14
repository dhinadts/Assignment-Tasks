import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;

class NotificationService {
  NotificationService._internal();
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  // ------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------
  Future<void> initialize() async {
    tz.initializeTimeZones();

    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');

    const iosInit = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const initSettings = InitializationSettings(
      android: androidInit,
      iOS: iosInit,
      macOS: iosInit,
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    if (Platform.isAndroid) {
      await _createAndroidChannel();
      await _requestAndroidPermissions();
    }

    if (Platform.isIOS || Platform.isMacOS) {
      await _requestApplePermissions();
    }
  }

  // ------------------------------------------------------------
  // PERMISSIONS
  // ------------------------------------------------------------
  Future<void> _requestAndroidPermissions() async {
    final androidPlugin = _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();

    // Android 13+ notification permission
    await androidPlugin?.requestNotificationsPermission();

    // Android 14+ exact alarms (safe to call)
    await androidPlugin?.requestExactAlarmsPermission();
  }

  Future<void> _requestApplePermissions() async {
    await _plugin
        .resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin
        >()
        ?.requestPermissions(alert: true, badge: true, sound: true);

    await _plugin
        .resolvePlatformSpecificImplementation<
          MacOSFlutterLocalNotificationsPlugin
        >()
        ?.requestPermissions(alert: true, badge: true, sound: true);
  }

  // ------------------------------------------------------------
  // ANDROID CHANNEL
  // ------------------------------------------------------------
  Future<void> _createAndroidChannel() async {
    const channel = AndroidNotificationChannel(
      'daily_quote_channel',
      'Daily Quotes',
      description: 'Daily inspirational quotes',
      importance: Importance.high,
    );

    await _plugin
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >()
        ?.createNotificationChannel(channel);
  }

  // ------------------------------------------------------------
  // DAILY SCHEDULE
  // ------------------------------------------------------------
  Future<void> scheduleDailyNotification({
    required int id,
    required String title,
    required String body,
    required TimeOfDay time,
  }) async {
    final now = tz.TZDateTime.now(tz.local);

    var scheduled = tz.TZDateTime(
      tz.local,
      now.year,
      now.month,
      now.day,
      time.hour,
      time.minute,
    );

    if (scheduled.isBefore(now)) {
      scheduled = scheduled.add(const Duration(days: 1));
    }

    await _plugin.cancel(id);

    const androidDetails = AndroidNotificationDetails(
      'daily_quote_channel',
      'Daily Quotes',
      channelDescription: 'Daily inspirational quotes',
      importance: Importance.high,
      priority: Priority.high,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
      macOS: iosDetails,
    );

    await _plugin.zonedSchedule(
      id,
      title,
      body,
      scheduled,
      details,
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time,
    );
  }

  // ------------------------------------------------------------
  // INSTANT NOTIFICATION
  // ------------------------------------------------------------
  Future<void> showInstantNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const details = NotificationDetails(
      android: AndroidNotificationDetails(
        'daily_quote_channel',
        'Daily Quotes',
        importance: Importance.high,
        priority: Priority.high,
      ),
      iOS: DarwinNotificationDetails(),
      macOS: DarwinNotificationDetails(),
    );

    await _plugin.show(999, title, body, details, payload: payload);
  }

  // ------------------------------------------------------------
  // CANCEL METHODS
  // ------------------------------------------------------------
  Future<void> cancel(int id) => _plugin.cancel(id);

  Future<void> cancelAll() => _plugin.cancelAll();

  // ------------------------------------------------------------
  // TAP HANDLER
  // ------------------------------------------------------------
  void _onNotificationTap(NotificationResponse response) {
    debugPrint('🔔 Notification tapped: ${response.payload}');
  }

  // ------------------------------------------------------------
  // DEBUG
  // ------------------------------------------------------------
  Future<void> logPendingNotifications() async {
    final pending = await _plugin.pendingNotificationRequests();
    for (final n in pending) {
      debugPrint('⏰ Pending: ${n.id} | ${n.title}');
    }
  }
}
