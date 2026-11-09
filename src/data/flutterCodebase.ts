import { FlutterCodeFile } from '../types';

export const FLUTTER_CODEBASE: FlutterCodeFile[] = [
  {
    filename: 'pubspec.yaml',
    path: 'pubspec.yaml',
    category: 'config',
    description: 'Flutter project configuration and package dependencies (provider, fl_chart, google_fonts, intl)',
    code: `name: study_flow
description: "StudyFlow - Smart Study Planner & Productivity App for Flutter UI Exam"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State Management (Teacher instruction: Provider)
  provider: ^6.1.2
  # Google Fonts for modern typography
  google_fonts: ^6.2.1
  # Icons & Formatting
  intl: ^0.19.0
  # Material Icons
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    filename: 'main.dart',
    path: 'lib/main.dart',
    category: 'core',
    description: 'App entry point, multi-provider state registration, custom dark/neon theme, and named route navigation',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/study_provider.dart';
import 'screens/dashboard_screen.dart';
import 'screens/pomodoro_screen.dart';
import 'screens/timetable_screen.dart';
import 'screens/tasks_screen.dart';
import 'screens/analytics_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => StudyProvider()),
      ],
      child: const StudyFlowApp(),
    ),
  );
}

class StudyFlowApp extends StatelessWidget {
  const StudyFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StudyFlow',
      debugShowCheckedModeBanner: false,
      // Consistent Theme Concept: Custom Dark Neon Theme
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        primaryColor: const Color(0xFF6366F1),
        cardColor: const Color(0xFF131B2E),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF131B2E),
          background: Color(0xFF0B0F19),
          error: Color(0xFFF43F5E),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B0F19),
          elevation: 0,
          centerTitle: false,
        ),
      ),
      // Navigation Concept: Named Routes
      initialRoute: '/',
      routes: {
        '/': (context) => const DashboardScreen(),
        '/pomodoro': (context) => const PomodoroScreen(),
        '/timetable': (context) => const TimetableScreen(),
        '/tasks': (context) => const TasksScreen(),
        '/analytics': (context) => const AnalyticsScreen(),
      },
    );
  }
}
`
  },
  {
    filename: 'study_provider.dart',
    path: 'lib/providers/study_provider.dart',
    category: 'providers',
    description: 'Centralized state management with ChangeNotifier (tasks CRUD, study hours, timer state, weekly goal)',
    code: `import 'dart:async';
import 'package:flutter/material.dart';
import '../models/study_task.dart';

class StudyProvider extends ChangeNotifier {
  // Weekly Goal and Progress State
  double _weeklyGoalHours = 56.0;
  double _studiedHours = 16.0;
  int _studyStreak = 56;
  int _studyPartners = 81;

  // Selected Day on Dashboard Calendar
  int _selectedDayIndex = 1; // Mon (Feb 16)

  // Pomodoro Focus Timer State
  int _timerDurationSeconds = 25 * 60;
  int _remainingSeconds = 25 * 60;
  bool _isTimerRunning = false;
  String _currentTimerMode = 'Focus'; // 'Focus', 'Short Break', 'Long Break'
  Timer? _timer;

  // Study Tasks State (CRUD)
  final List<StudyTask> _tasks = [
    StudyTask(
      id: 'task-1',
      title: 'Morning Review: Flutter UI Widgets & Tree',
      subject: 'Mobile App Dev (Flutter)',
      priority: TaskPriority.high,
      completed: false,
      dueDate: DateTime.now().add(const Duration(days: 1)),
      estimatedHours: 1.0,
      completedHours: 0.5,
    ),
    StudyTask(
      id: 'task-2',
      title: 'Reading Assignment: State Management & Provider',
      subject: 'Mobile App Dev (Flutter)',
      priority: TaskPriority.medium,
      completed: false,
      dueDate: DateTime.now().add(const Duration(days: 1)),
      estimatedHours: 1.0,
      completedHours: 0.0,
    ),
    StudyTask(
      id: 'task-3',
      title: 'Maths Calculus Assignment',
      subject: 'Discrete Mathematics',
      priority: TaskPriority.high,
      completed: false,
      dueDate: DateTime.now().add(const Duration(days: 2)),
      estimatedHours: 3.5,
      completedHours: 1.0,
    ),
    StudyTask(
      id: 'task-4',
      title: 'Implement Binary Search Tree balancing in Dart',
      subject: 'Data Structures',
      priority: TaskPriority.medium,
      completed: true,
      dueDate: DateTime.now().subtract(const Duration(days: 1)),
      estimatedHours: 2.0,
      completedHours: 2.0,
    ),
  ];

  // Getters
  double get weeklyGoalHours => _weeklyGoalHours;
  double get studiedHours => _studiedHours;
  double get remainingHours => (_weeklyGoalHours - _studiedHours).clamp(0, 999);
  double get progressPercentage => (_studiedHours / _weeklyGoalHours).clamp(0.0, 1.0);
  int get studyStreak => _studyStreak;
  int get studyPartners => _studyPartners;
  int get selectedDayIndex => _selectedDayIndex;

  int get remainingSeconds => _remainingSeconds;
  bool get isTimerRunning => _isTimerRunning;
  String get currentTimerMode => _currentTimerMode;
  List<StudyTask> get tasks => List.unmodifiable(_tasks);
  List<StudyTask> get pendingTasks => _tasks.where((t) => !t.completed).toList();
  List<StudyTask> get completedTasks => _tasks.where((t) => t.completed).toList();

  // Task CRUD Methods
  void addTask(StudyTask task) {
    _tasks.add(task);
    notifyListeners();
  }

  void toggleTaskCompletion(String taskId) {
    final index = _tasks.indexWhere((t) => t.id == taskId);
    if (index != -1) {
      _tasks[index] = _tasks[index].copyWith(
        completed: !_tasks[index].completed,
      );
      notifyListeners();
    }
  }

  void deleteTask(String taskId) {
    _tasks.removeWhere((t) => t.id == taskId);
    notifyListeners();
  }

  void logStudyHours(double hours, String subject) {
    _studiedHours += hours;
    notifyListeners();
  }

  void setWeeklyGoal(double goal) {
    _weeklyGoalHours = goal;
    notifyListeners();
  }

  void setSelectedDayIndex(int index) {
    _selectedDayIndex = index;
    notifyListeners();
  }

  // Pomodoro Actions
  void startTimer() {
    if (_isTimerRunning) return;
    _isTimerRunning = true;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        _remainingSeconds--;
        notifyListeners();
      } else {
        stopTimer();
        _studiedHours += (_timerDurationSeconds / 3600);
        notifyListeners();
      }
    });
    notifyListeners();
  }

  void pauseTimer() {
    _timer?.cancel();
    _isTimerRunning = false;
    notifyListeners();
  }

  void stopTimer() {
    _timer?.cancel();
    _isTimerRunning = false;
    _remainingSeconds = _timerDurationSeconds;
    notifyListeners();
  }

  void setTimerMode(String mode) {
    _currentTimerMode = mode;
    if (mode == 'Focus') {
      _timerDurationSeconds = 25 * 60;
    } else if (mode == 'Short Break') {
      _timerDurationSeconds = 5 * 60;
    } else {
      _timerDurationSeconds = 15 * 60;
    }
    stopTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
`
  },
  {
    filename: 'study_task.dart',
    path: 'lib/models/study_task.dart',
    category: 'models',
    description: 'Data model for tasks, priorities, completion status, and copyWith pattern',
    code: `enum TaskPriority { low, medium, high }

class StudyTask {
  final String id;
  final String title;
  final String subject;
  final TaskPriority priority;
  final bool completed;
  final DateTime dueDate;
  final double estimatedHours;
  final double completedHours;

  const StudyTask({
    required this.id,
    required this.title,
    required this.subject,
    required this.priority,
    required this.completed,
    required this.dueDate,
    required this.estimatedHours,
    this.completedHours = 0.0,
  });

  StudyTask copyWith({
    String? id,
    String? title,
    String? subject,
    TaskPriority? priority,
    bool? completed,
    DateTime? dueDate,
    double? estimatedHours,
    double? completedHours,
  }) {
    return StudyTask(
      id: id ?? this.id,
      title: title ?? this.title,
      subject: subject ?? this.subject,
      priority: priority ?? this.priority,
      completed: completed ?? this.completed,
      dueDate: dueDate ?? this.dueDate,
      estimatedHours: estimatedHours ?? this.estimatedHours,
      completedHours: completedHours ?? this.completedHours,
    );
  }
}
`
  },
  {
    filename: 'custom_widgets.dart',
    path: 'lib/widgets/custom_widgets.dart',
    category: 'widgets',
    description: 'Reusable custom widgets: StatCard, BentoCard, CustomProgressBar, CategoryPill',
    code: `import 'package:flutter/material.dart';

// Reusable Stat Card Widget (Teacher Concept: Custom Reusable Widgets & Cards)
class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color accentColor;
  final Widget? trailingBadge;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    this.accentColor = const Color(0xFF6366F1),
    this.trailingBadge,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF131B2E),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: Colors.white.withOpacity(0.06),
          width: 1.0,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 18, color: accentColor),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              if (trailingBadge != null) trailingBadge!,
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 26,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

// Bento Gradient Card Widget (Teacher Concept: Container, Stack, Gradients)
class BentoCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String description;
  final Gradient gradient;
  final Widget? actionWidget;

  const BentoCard({
    super.key,
    required this.title,
    this.subtitle = '',
    required this.description,
    required this.gradient,
    this.actionWidget,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        gradient: gradient,
        borderRadius: BorderRadius.circular(16.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (subtitle.isNotEmpty) ...[
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    subtitle,
                    style: const TextStyle(color: Colors.white, fontSize: 11),
                  ),
                ),
              ],
              const SizedBox(height: 8),
              Text(
                description,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 12,
                  height: 1.3,
                ),
              ),
            ],
          ),
          if (actionWidget != null) ...[
            const SizedBox(height: 12),
            actionWidget!,
          ],
        ],
      ),
    );
  }
}
`
  },
  {
    filename: 'dashboard_screen.dart',
    path: 'lib/screens/dashboard_screen.dart',
    category: 'screens',
    description: 'Main responsive dashboard fulfilling widgets (Container, Row, Column, Stack, ListView, GridView, MediaQuery)',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_provider.dart';
import '../widgets/custom_widgets.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Teacher Concept: Responsive UI Design using MediaQuery
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 900;
    final isTablet = size.width > 600 && size.width <= 900;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.bolt, color: Color(0xFF6366F1), size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'StudyFlow',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.timer_outlined),
            onPressed: () => Navigator.pushNamed(context, '/pomodoro'),
            tooltip: 'Pomodoro Timer',
          ),
          IconButton(
            icon: const Icon(Icons.calendar_today_outlined),
            onPressed: () => Navigator.pushNamed(context, '/timetable'),
            tooltip: 'Timetable',
          ),
          IconButton(
            icon: const Icon(Icons.checklist_rounded),
            onPressed: () => Navigator.pushNamed(context, '/tasks'),
            tooltip: 'All Tasks',
          ),
          IconButton(
            icon: const Icon(Icons.bar_chart_rounded),
            onPressed: () => Navigator.pushNamed(context, '/analytics'),
            tooltip: 'Analytics',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Consumer<StudyProvider>(
        builder: (context, provider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: isDesktop
                // Desktop: 3 Column Row layout
                ? Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Left Column: Stats Cards (Weekly Progress, Streak, Partners, Deadline)
                      SizedBox(
                        width: 280,
                        child: _buildLeftColumn(context, provider),
                      ),
                      const SizedBox(width: 16),
                      // Middle Column: Bento Cards + Spline Study Time Chart
                      Expanded(
                        child: _buildMiddleColumn(context, provider),
                      ),
                      const SizedBox(width: 16),
                      // Right Column: Quick Actions + Calendar + To-do List
                      SizedBox(
                        width: 300,
                        child: _buildRightColumn(context, provider),
                      ),
                    ],
                  )
                : Column(
                    // Mobile & Tablet: Stacked responsive layout
                    children: [
                      _buildMiddleColumn(context, provider),
                      const SizedBox(height: 16),
                      _buildLeftColumn(context, provider),
                      const SizedBox(height: 16),
                      _buildRightColumn(context, provider),
                    ],
                  ),
          );
        },
      ),
    );
  }

  Widget _buildLeftColumn(BuildContext context, StudyProvider provider) {
    return Column(
      children: [
        // Weekly Progress Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF131B2E),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.bar_chart, color: Color(0xFF38BDF8), size: 18),
                      SizedBox(width: 6),
                      Text('Weekly Progress', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    ],
                  ),
                  Text('Goal: \${provider.weeklyGoalHours.toInt()}h', style: const TextStyle(color: Colors.white60, fontSize: 11)),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '\${provider.studiedHours.toStringAsFixed(1)}',
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white),
                  ),
                  const SizedBox(width: 4),
                  const Text('hrs', style: TextStyle(color: Colors.white60, fontSize: 14)),
                ],
              ),
              const SizedBox(height: 10),
              // Linear Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: provider.progressPercentage,
                  minHeight: 8,
                  backgroundColor: Colors.white.withOpacity(0.1),
                  valueColor: const AlwaysStoppedAnimation(Color(0xFF38BDF8)),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '🎯 \${provider.remainingHours.toStringAsFixed(0)}h more to goal',
                style: const TextStyle(color: Colors.white60, fontSize: 11),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Study Streak
        StatCard(
          title: 'Study Streak',
          value: '\${provider.studyStreak} days',
          subtitle: 'Building great habits! 🎯',
          icon: Icons.local_fire_department,
          accentColor: const Color(0xFF10B981),
          trailingBadge: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Text('Active', style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 12),
        // Study Partners
        StatCard(
          title: 'Study Partners',
          value: '\${provider.studyPartners} partners',
          subtitle: 'Community star! 🌟',
          icon: Icons.people_alt_rounded,
          accentColor: const Color(0xFF818CF8),
        ),
        const SizedBox(height: 12),
        // Next Deadline Card (Stack Widget Example)
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF131B2E),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: const Row(
            children: [
              Icon(Icons.alarm, color: Color(0xFFF43F5E), size: 24),
              SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Next Deadline', style: TextStyle(color: Colors.white60, fontSize: 11)),
                  SizedBox(height: 2),
                  Text('Maths Assignment', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  Text('Due in 1 day', style: TextStyle(color: Color(0xFFF43F5E), fontSize: 11)),
                ],
              )
            ],
          ),
        )
      ],
    );
  }

  Widget _buildMiddleColumn(BuildContext context, StudyProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Bento Row (GridView or Flex Row)
        LayoutBuilder(
          builder: (context, constraints) {
            final isNarrow = constraints.maxWidth < 600;
            return isNarrow
                ? Column(
                    children: _bentoCards(context),
                  )
                : Row(
                    children: _bentoCards(context).map((card) => Expanded(child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: card,
                    ))).toList(),
                  );
          },
        ),
        const SizedBox(height: 16),
        // Weekly Study Time Chart Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFF131B2E),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Weekly Study Time', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                      SizedBox(height: 2),
                      Text('Track your study hours and progress', style: TextStyle(color: Colors.white60, fontSize: 12)),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showLogTimeDialog(context, provider),
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Log Time'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Simulated Chart Area with Custom Paint / Graph Bars
              SizedBox(
                height: 160,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _chartBar('Thu', 0.5),
                    _chartBar('Fri', 0.8),
                    _chartBar('Sat', 3.2),
                    _chartBar('Sun', 1.5),
                    _chartBar('Mon', 10.8, isHighlight: true),
                    _chartBar('Tue', 2.2),
                    _chartBar('Wed', 1.0),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Category Legend
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: const [
                  _categoryChip('Coding 2.0h', Color(0xFF38BDF8)),
                  _categoryChip('Algorithms 10.0h', Color(0xFF06B6D4)),
                  _categoryChip('Software Tool 1.0h', Color(0xFF10B981)),
                  _categoryChip('Data Structures 3.0h', Color(0xFFEAB308)),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  static Widget _chartBar(String label, double hours, {bool isHighlight = false}) {
    final double maxH = 11.0;
    final double heightRatio = (hours / maxH).clamp(0.05, 1.0);
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text('\${hours}h', style: const TextStyle(fontSize: 10, color: Colors.white60)),
        const SizedBox(height: 4),
        Container(
          width: 24,
          height: 110 * heightRatio,
          decoration: BoxDecoration(
            color: isHighlight ? const Color(0xFF6366F1) : const Color(0xFF38BDF8).withOpacity(0.4),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
      ],
    );
  }

  static Widget _categoryChip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600)),
    );
  }

  List<Widget> _bentoCards(BuildContext context) {
    return [
      BentoCard(
        title: 'Did You Know?',
        description: '🚫 Multitasking cuts efficiency—switching costs can waste up to 40% time.',
        gradient: const LinearGradient(
          colors: [Color(0xFF0284C7), Color(0xFF0EA5E9)],
        ),
      ),
      BentoCard(
        title: 'Study Challenge',
        subtitle: 'Your rank: #3',
        description: 'Do Pomodoro sprints and reward yourself after finishing.',
        gradient: const LinearGradient(
          colors: [Color(0xFF7C3AED), Color(0xFF9333EA)],
        ),
      ),
      BentoCard(
        title: 'Tool of the Day',
        description: 'Study Rooms - Join or create real-time study rooms to stay accountable.',
        gradient: const LinearGradient(
          colors: [Color(0xFFE11D48), Color(0xFFF43F5E)],
        ),
      ),
    ];
  }

  Widget _buildRightColumn(BuildContext context, StudyProvider provider) {
    return Column(
      children: [
        // Quick Actions
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF131B2E),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('⚡ Quick Actions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _actionButton(context, Icons.psychology, 'AI Tutor', const Color(0xFF10B981), () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('AI Study Tutor Activated!')));
                    }),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _actionButton(context, Icons.draw_outlined, 'Whiteboard', const Color(0xFFA855F7), () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Whiteboard Canvas Ready!')));
                    }),
                  ),
                ],
              )
            ],
          ),
        ),
        const SizedBox(height: 16),
        // To-Do List Preview
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF131B2E),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.06)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('To-do List', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/tasks'),
                    child: const Text('View All', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              // ListView of Tasks
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: provider.tasks.take(3).length,
                itemBuilder: (context, index) {
                  final task = provider.tasks[index];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    leading: Checkbox(
                      value: task.completed,
                      onChanged: (_) => provider.toggleTaskCompletion(task.id),
                      activeColor: const Color(0xFF6366F1),
                    ),
                    title: Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 12,
                        decoration: task.completed ? TextDecoration.lineThrough : null,
                        color: task.completed ? Colors.white38 : Colors.white,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  static Widget _actionButton(BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  void _showLogTimeDialog(BuildContext context, StudyProvider provider) {
    final formKey = GlobalKey<FormState>();
    final hoursController = TextEditingController();
    String selectedSubject = 'Mobile App Dev (Flutter)';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF131B2E),
        title: const Text('Log Study Session', style: TextStyle(color: Colors.white)),
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: hoursController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Hours studied (e.g. 1.5)',
                  labelStyle: TextStyle(color: Colors.white60),
                ),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Enter hours';
                  final numVal = double.tryParse(val);
                  if (numVal == null || numVal <= 0) return 'Must be > 0';
                  return null;
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (formKey.currentState!.validate()) {
                final hrs = double.parse(hoursController.text);
                provider.logStudyHours(hrs, selectedSubject);
                Navigator.pop(ctx);
              }
            },
            child: const Text('Save Log'),
          )
        ],
      ),
    );
  }
}
`
  },
  {
    filename: 'pomodoro_screen.dart',
    path: 'lib/screens/pomodoro_screen.dart',
    category: 'screens',
    description: 'Pomodoro focus timer screen fulfilling animations (AnimationController) & State management',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_provider.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({super.key});

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

// Teacher Concept: Animations with SingleTickerProviderStateMixin & AnimationController
class _PomodoroScreenState extends State<PomodoroScreen> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  String _formatTime(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '\$minutes:\$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<StudyProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pomodoro Focus Sprint'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Mode Selector (Row + Buttons)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: ['Focus', 'Short Break', 'Long Break'].map((mode) {
                  final isSelected = provider.currentTimerMode == mode;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(mode),
                      selected: isSelected,
                      selectedColor: const Color(0xFF6366F1),
                      onSelected: (_) => provider.setTimerMode(mode),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 40),
              // Circular Timer Display with Pulse Animation
              AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  return Container(
                    width: 240,
                    height: 240,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          const Color(0xFF6366F1).withOpacity(provider.isTimerRunning ? 0.25 : 0.1),
                          Colors.transparent,
                        ],
                      ),
                      border: Border.all(
                        color: provider.isTimerRunning
                            ? const Color(0xFF6366F1)
                            : Colors.white24,
                        width: 4,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      _formatTime(provider.remainingSeconds),
                      style: const TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 2,
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 40),
              // Play / Pause / Reset Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: provider.isTimerRunning ? provider.pauseTimer : provider.startTimer,
                    icon: Icon(provider.isTimerRunning ? Icons.pause : Icons.play_arrow),
                    label: Text(provider.isTimerRunning ? 'Pause' : 'Start Focus'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    ),
                  ),
                  const SizedBox(width: 16),
                  OutlinedButton.icon(
                    onPressed: provider.stopTimer,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Reset'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    filename: 'tasks_screen.dart',
    path: 'lib/screens/tasks_screen.dart',
    category: 'screens',
    description: 'Forms and Validation screen: GlobalKey<FormState>, TextFormField, validator, Dismissible',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_provider.dart';
import '../models/study_task.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  // Teacher Concept: Forms and Validation with GlobalKey<FormState>
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _subjectController = TextEditingController();
  final _hoursController = TextEditingController();
  TaskPriority _selectedPriority = TaskPriority.medium;

  void _openAddTaskModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF131B2E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Study Task', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 16),
              // Task Title Input with Validation
              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Task Title *',
                  hintText: 'e.g., Complete Flutter Provider Lab',
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter a task title';
                  }
                  if (val.trim().length < 3) {
                    return 'Title must be at least 3 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),
              // Subject Input
              TextFormField(
                controller: _subjectController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Subject *',
                  hintText: 'e.g., Mobile App Development',
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter the subject name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),
              // Hours Input with Number Validation
              TextFormField(
                controller: _hoursController,
                keyboardType: TextInputType.number,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Estimated Hours *',
                  hintText: 'e.g., 2.5',
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter estimated hours';
                  final d = double.tryParse(val);
                  if (d == null || d <= 0) return 'Must be a valid positive number';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      final newTask = StudyTask(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        title: _titleController.text.trim(),
                        subject: _subjectController.text.trim(),
                        priority: _selectedPriority,
                        completed: false,
                        dueDate: DateTime.now().add(const Duration(days: 2)),
                        estimatedHours: double.parse(_hoursController.text),
                      );
                      Provider.of<StudyProvider>(context, listen: false).addTask(newTask);
                      _titleController.clear();
                      _subjectController.clear();
                      _hoursController.clear();
                      Navigator.pop(ctx);
                    }
                  },
                  child: const Text('Add Task to Flow'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<StudyProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Tasks & Schedule'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openAddTaskModal(context),
        backgroundColor: const Color(0xFF6366F1),
        child: const Icon(Icons.add),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: provider.tasks.length,
        itemBuilder: (context, index) {
          final task = provider.tasks[index];
          // Dismissible Widget for Swiping / Deleting
          return Dismissible(
            key: Key(task.id),
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              color: const Color(0xFFF43F5E),
              child: const Icon(Icons.delete, color: Colors.white),
            ),
            onDismissed: (_) => provider.deleteTask(task.id),
            child: Card(
              color: const Color(0xFF131B2E),
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: ListTile(
                leading: Checkbox(
                  value: task.completed,
                  activeColor: const Color(0xFF6366F1),
                  onChanged: (_) => provider.toggleTaskCompletion(task.id),
                ),
                title: Text(
                  task.title,
                  style: TextStyle(
                    color: task.completed ? Colors.white38 : Colors.white,
                    decoration: task.completed ? TextDecoration.lineThrough : null,
                  ),
                ),
                subtitle: Text(
                  '\${task.subject} • \${task.estimatedHours}h',
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
`
  },
  {
    filename: 'timetable_screen.dart',
    path: 'lib/screens/timetable_screen.dart',
    category: 'screens',
    description: 'Weekly timetable schedule utilizing GridView and responsive cards',
    code: `import 'package:flutter/material.dart';

class TimetableScreen extends StatelessWidget {
  const TimetableScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Weekly Academic Timetable'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: days.length,
        itemBuilder: (context, dayIdx) {
          return Card(
            color: const Color(0xFF131B2E),
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    days[dayIdx],
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF38BDF8)),
                  ),
                  const SizedBox(height: 12),
                  // Slots
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Mobile Application Dev (Flutter)', style: TextStyle(fontWeight: FontWeight.w600)),
                            Text('Lab 3B • Prof. Jenkins', style: TextStyle(fontSize: 12, color: Colors.white54)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6366F1).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('09:00 - 11:00 AM', style: TextStyle(fontSize: 11, color: Color(0xFF818CF8))),
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
`
  },
  {
    filename: 'analytics_screen.dart',
    path: 'lib/screens/analytics_screen.dart',
    category: 'screens',
    description: 'Visual analytics, subject breakdown charts, and study habits history',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_provider.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<StudyProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Analytics & Progress'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Overall KPI Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF131B2E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _metricTile('Total Hours', '\${provider.studiedHours.toStringAsFixed(1)}h', Icons.timer),
                  _metricTile('Streak', '\${provider.studyStreak} Days', Icons.local_fire_department),
                  _metricTile('Tasks Done', '\${provider.completedTasks.length}', Icons.check_circle_outline),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Subject Distribution', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _subjectBar('Algorithms', 10.0, 16.0, const Color(0xFF06B6D4)),
            _subjectBar('Data Structures', 3.0, 16.0, const Color(0xFFEAB308)),
            _subjectBar('Flutter & Mobile Dev', 2.0, 16.0, const Color(0xFF38BDF8)),
            _subjectBar('Software Tools', 1.0, 16.0, const Color(0xFF10B981)),
          ],
        ),
      ),
    );
  }

  static Widget _metricTile(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF6366F1), size: 28),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.white54)),
      ],
    );
  }

  static Widget _subjectBar(String title, double hours, double total, Color color) {
    final pct = (hours / total).clamp(0.0, 1.0);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
              Text('\${hours.toStringAsFixed(1)}h (\${(pct * 100).toInt()}%)', style: const TextStyle(fontSize: 12, color: Colors.white60)),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: pct,
              minHeight: 8,
              backgroundColor: Colors.white.withOpacity(0.08),
              valueColor: AlwaysStoppedAnimation(color),
            ),
          )
        ],
      ),
    );
  }
}
`
  }
];
