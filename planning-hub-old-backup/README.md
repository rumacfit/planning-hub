# Planning Hub - Staff Calendar

A comprehensive planning and staff calendar application for team management. Features daily, weekly, and yearly calendar views with the ability to view individual staff calendars or a combined "All Staff" view.

## Features

- **Daily View**: See events and tasks for a specific day with full details
- **Weekly View**: Overview of the week with quick navigation to daily views
- **Staff Calendar View**: 
  - View individual staff member calendars
  - **Combined "All Staff" view** to see everyone's availability at once
  - Color-coded events per staff member
  - Year-at-a-glance calendar with event indicators
- **Staff Management**: Add, edit, and delete staff members with custom colors
- **Event Management**: Create events with title, date, time, location, and staff assignment
- **Task Management**: Create tasks with due dates, priority levels, and staff assignment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd planning-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

### Viewing All Staff Together

1. Click on "Staff Calendar" in the navigation
2. In the left sidebar, click on "All Staff" at the top of the staff list
3. You'll see a combined view with color-coded dots indicating which staff members have events on each day
4. The legend at the top shows which color belongs to which staff member

### Adding Staff Members

1. Go to Staff Calendar view
2. Click "+ Add Staff" button
3. Fill in name, email, position, and select a color
4. Click "Add Staff"

### Adding Events

1. Navigate to Daily view
2. Click "+ Add Event"
3. Fill in event details and assign to a staff member
4. Click "Add Event"

## Tech Stack

- React 18
- Vite
- CSS (custom, no framework)

## License

MIT
