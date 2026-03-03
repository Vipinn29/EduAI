import Card from '@/components/Card';

export default function Dashboard() {
  const stats = [
    { label: 'Learning Streak', value: '7 days' },
    { label: 'Courses Completed', value: '3' },
    { label: 'Total Hours', value: '24.5' },
    { label: 'Current Level', value: 'Intermediate' },
  ];

  const recentCourses = [
    { title: 'React Fundamentals', progress: 75 },
    { title: 'TypeScript Basics', progress: 90 },
    { title: 'Web Design Patterns', progress: 45 },
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Recent Courses */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Courses
            </h2>
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </h3>
                    <span className="text-primary font-semibold">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <Card title="Weekly Statistics" className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-2xl font-bold text-primary">4.5 hours</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Lessons Completed</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
