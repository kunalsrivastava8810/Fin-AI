const WhyChooseUs = () => {
    return (
      <div className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 mb-8">We provide AI-powered financial insights to help you save, invest, and achieve your goals smarter and faster.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h3>
            <p className="text-gray-600 mt-2">Our AI analyzes your financial habits and provides personalized recommendations.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">Smart Budgeting</h3>
            <p className="text-gray-600 mt-2">Track your expenses, reduce unnecessary spending, and optimize savings efficiently.</p>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">Goal-Based Planning</h3>
            <p className="text-gray-600 mt-2">Set financial goals and let our AI guide you in achieving them with ease.</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default WhyChooseUs;