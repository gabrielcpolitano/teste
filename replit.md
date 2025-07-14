# Ponto Dev - TechFoco Inc. Time Tracking System

## Overview

This is a professional time tracking web application called "Ponto Dev" that simulates a corporate environment for a fictional company called TechFoco Inc. The system is designed to create an immersive experience for study discipline, making the user feel like a real employee who needs to track their daily work hours. The application focuses on motivating consistent study habits through a corporate-style interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a simple client-side architecture built with vanilla web technologies:

- **Frontend**: Single Page Application (SPA) using vanilla HTML, CSS, and JavaScript
- **Styling**: TailwindCSS for responsive UI components
- **Data Storage**: Browser LocalStorage for persistent data
- **State Management**: Class-based JavaScript architecture with centralized state
- **Icons**: Feather Icons for consistent UI elements

## Key Components

### 1. Authentication System
- **Purpose**: Simulates corporate login experience
- **Implementation**: Simple name input field (defaults to "Gabriel")
- **Features**: Welcome message and workday initialization

### 2. Dashboard Interface
- **Purpose**: Main workspace mimicking corporate time tracking systems
- **Components**:
  - Header with company branding
  - Real-time clock display
  - Status indicators
  - Motivational messaging system

### 3. Time Tracking Engine
- **Core Class**: `PontoDevSystem`
- **Features**:
  - Multiple sessions per day support
  - Clock in/out functionality
  - Daily time accumulation
  - 3-hour minimum target validation
  - Workday completion tracking

### 4. Data Management
- **Storage**: Browser LocalStorage
- **Data Types**:
  - User sessions
  - Daily time records
  - Workday status
  - Historical data

## Data Flow

1. **Login Process**: User enters name → System initializes workday → Dashboard loads
2. **Time Tracking**: Clock in → Active session → Clock out → Session saved
3. **Data Persistence**: All actions saved to LocalStorage in real-time
4. **Status Updates**: UI updates reflect current session state and accumulated time

## External Dependencies

- **TailwindCSS**: Delivered via CDN for styling framework
- **Feather Icons**: Delivered via CDN for consistent iconography
- **No backend dependencies**: Fully client-side application

## Deployment Strategy

The application is designed for simple static hosting:

- **Files**: Single HTML file with embedded CSS and JavaScript
- **Assets**: All dependencies loaded via CDN
- **Compatibility**: Works in any modern web browser
- **No build process**: Ready to deploy as-is

### Key Technical Decisions

1. **Vanilla JavaScript**: Chosen for simplicity and direct DOM manipulation without framework overhead
2. **LocalStorage**: Provides persistence without requiring backend infrastructure
3. **Class-based Architecture**: Organizes code in a maintainable structure while keeping it simple
4. **Corporate Theme**: Creates psychological motivation through professional interface design
5. **Multiple Sessions**: Supports realistic work patterns with breaks and multiple study periods

The system prioritizes user experience and motivation while maintaining simplicity in implementation and deployment.