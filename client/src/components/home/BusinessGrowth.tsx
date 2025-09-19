import React from 'react'
import {
  BarChartIcon,
  CheckCircleIcon,
  StarIcon,
  XIcon,
  CheckIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  ThumbsUpIcon,
  UsersIcon,
  ClockIcon,
  BellIcon,
  PieChartIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react'
const BusinessGrowthSection = () => {
  const comparisonData = [
    {
      category: 'Audience Trust',
      traditional: {
        title: 'Skepticism & Ad Fatigue',
        description: 'Consumers increasingly ignore or block traditional ads',
        icon: <XIcon className="h-5 w-5" />,
        rating: 'Low',
        trend: 'down',
      },
      creator: {
        title: 'Authentic Recommendations',
        description:
          'Audiences trust creators they follow for genuine recommendations',
        icon: <CheckIcon className="h-5 w-5" />,
        rating: 'Very High',
        trend: 'up',
      },
    },
    {
      category: 'Customer Acquisition',
      traditional: {
        title: 'Mass Targeting',
        description: 'Broad audience targeting with high waste factor',
        icon: <MegaphoneIcon className="h-5 w-5" />,
        rating: 'Moderate',
        trend: 'neutral',
      },
      creator: {
        title: 'Precision Engagement',
        description:
          'Reach specific audiences through relevant creator partnerships',
        icon: <ThumbsUpIcon className="h-5 w-5" />,
        rating: 'High',
        trend: 'up',
      },
    },
    {
      category: 'Content Creation',
      traditional: {
        title: 'In-House Production',
        description: 'Expensive production costs with formal approval cycles',
        icon: <BriefcaseIcon className="h-5 w-5" />,
        rating: 'Low',
        trend: 'down',
      },
      creator: {
        title: 'Authentic Creator Content',
        description: 'Diverse, authentic content created by passionate experts',
        icon: <StarIcon className="h-5 w-5" />,
        rating: 'Excellent',
        trend: 'up',
      },
    },
    {
      category: 'Customer Relationship',
      traditional: {
        title: 'One-Way Communication',
        description: 'Broadcast messaging with limited feedback loops',
        icon: <BellIcon className="h-5 w-5" />,
        rating: 'Low',
        trend: 'down',
      },
      creator: {
        title: 'Community Building',
        description:
          'Two-way engagement that fosters loyal customer communities',
        icon: <UsersIcon className="h-5 w-5" />,
        rating: 'Very High',
        trend: 'up',
      },
    },
  ]
  // Get color class based on rating
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Low':
        return 'text-red-500'
      case 'Moderate':
        return 'text-yellow-500'
      case 'High':
        return 'text-green-500'
      case 'Very High':
        return 'text-green-600'
      case 'Excellent':
        return 'text-green-700'
      default:
        return 'text-gray-500'
    }
  }
  // Get trend icon based on trend
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDownIcon className="h-4 w-4 text-red-500" />
      default:
        return (
          <div className="h-4 w-4 flex items-center justify-center">
            <span className="h-0.5 w-3 bg-yellow-500 rounded-full"></span>
          </div>
        )
    }
  }
  // Get rating bar width based on rating
  const getRatingWidth = (rating) => {
    switch (rating) {
      case 'Low':
        return 'w-1/5'
      case 'Moderate':
        return 'w-2/5'
      case 'High':
        return 'w-3/5'
      case 'Very High':
        return 'w-4/5'
      case 'Excellent':
        return 'w-full'
      default:
        return 'w-0'
    }
  }
  return (
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mt-16 max-w-5xl mx-auto">
          {/* Marketing Comparison Chart - Modern Design */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white to-[#f9fdfc] rounded-3xl shadow-xl px-6 pb-10 relative overflow-hidden">
              <div className="text-center mb-8 relative z-10">
              </div>
              {/* Chart Headers */}
              <div className="flex justify-between mb-8 relative z-10 px-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 shadow-sm">
                    <BriefcaseIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 block">
                      Traditional
                    </span>
                    <span className="text-xs text-gray-500">
                      Conventional marketing
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <span className="font-bold text-[#3D9A8C] block text-right">
                      Creator-Driven
                    </span>
                    <span className="text-xs text-gray-500 block text-right">
                      Modern approach
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3D9A8C] to-[#5cbfb0] flex items-center justify-center ml-2 shadow-sm">
                    <StarIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              {/* Comparison Rows */}
              <div className="space-y-8 relative z-10">
                {comparisonData.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Category Label */}
                    <div className="flex justify-center mb-4">
                      <span className="px-4 py-1 bg-gradient-to-r from-[#e8f5f3] to-[#fff5f2] text-gray-700 rounded-full text-sm font-medium shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    {/* Comparison Row */}
                    <div className="flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden">
                      {/* Traditional Side */}
                      <div className="w-1/2 p-4 border-r border-gray-100">
                        <div className="flex items-start mb-2">
                          <div className="flex-shrink-0 bg-gray-200 p-2 rounded-lg">
                            <div className="text-gray-600">
                              {item.traditional.icon}
                            </div>
                          </div>
                          <div className="ml-3">
                            <h4 className="font-bold text-gray-700 text-sm">
                              {item.traditional.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.traditional.description}
                            </p>
                          </div>
                        </div>
                        {/* Rating Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-bold ${getRatingColor(item.traditional.rating)}`}
                            >
                              {item.traditional.rating}
                            </span>
                            <div className="flex items-center">
                              {getTrendIcon(item.traditional.trend)}
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gray-400 rounded-full ${getRatingWidth(item.traditional.rating)}`}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {/* Creator Side */}
                      <div className="w-1/2 p-4 bg-gradient-to-br from-white to-[#f9fdfc]">
                        <div className="flex items-start mb-2">
                          <div className="flex-shrink-0 bg-gradient-to-br from-[#e8f5f3] to-[#fff5f2] p-2 rounded-lg">
                            <div className="text-[#3D9A8C]">
                              {item.creator.icon}
                            </div>
                          </div>
                          <div className="ml-3">
                            <h4 className="font-bold text-[#3D9A8C] text-sm">
                              {item.creator.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {item.creator.description}
                            </p>
                          </div>
                        </div>
                        {/* Rating Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-bold ${getRatingColor(item.creator.rating)}`}
                            >
                              {item.creator.rating}
                            </span>
                            <div className="flex items-center">
                              {getTrendIcon(item.creator.trend)}
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r from-[#3D9A8C] to-[#5cbfb0] rounded-full ${getRatingWidth(item.creator.rating)}`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Connecting element between rows */}
                    {index < comparisonData.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="h-4 w-px bg-gradient-to-b from-gray-200 to-transparent"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
export default BusinessGrowthSection
