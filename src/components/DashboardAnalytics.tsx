const DashboardAnalytics = ({views , likes , comments , contact}:{views:number ; likes:number; comments:number; contact:number}) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-green-400 h-50 rounded-xl flex justify-center items-center flex-col">
            <p className="text-3xl font-bold">{views}</p>
            <h1 >Total Views</h1>
        </div>
        <div className="bg-red-400 h-50 rounded-xl flex justify-center items-center flex-col">
            <p className="text-3xl font-bold">{likes}</p>
            <h1 >Total Likes</h1>
        </div>
        <a href="/dashboard/comments">
            <div className="bg-blue-400 h-50 rounded-xl flex justify-center items-center flex-col cursor-pointer">
                <p className="text-3xl font-bold">{comments}</p>
                <h1 >Total Comments</h1>
            </div>
        </a>
        <a href="/dashboard/reviews">
            <div className="bg-amber-400 h-50 rounded-xl flex justify-center items-center flex-col cursor-pointer">
                <p className="text-3xl font-bold">{contact}</p>
                <h1 >Contact Support</h1>
            </div>
        </a>
    </div>
  )
}

export default DashboardAnalytics;