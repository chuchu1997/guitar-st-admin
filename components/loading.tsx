/** @format */

const CircleLoading = () => {

    return (
      <div className="bg-red-500 flex justify-center items-center h-screen bg-white">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
        </div>
      </div>
    );
  };
  
  export default CircleLoading;
  