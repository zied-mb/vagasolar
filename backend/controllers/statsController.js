const Lead = require('../models/Lead');
const Message = require('../models/Message');
const Subscriber = require('../models/Subscriber');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');

// @desc    Get aggregated dashboard stats
// @route   GET /api/stats/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      leadsCount,
      newLeadsCount,
      recentLeads,
      messagesCount,
      recentMessages,
      subscribersCount,
      publishedProjectsCount,
      draftProjectsCount,
      testimonialsCount,
      leadGrowthRaw
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.find().sort({ createdAt: -1 }).limit(10),
      Message.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5).select('name email subject createdAt'),
      Subscriber.countDocuments(),
      Project.countDocuments({ active: true }),
      Project.countDocuments({ active: false }),
      Testimonial.countDocuments(),
      Lead.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ])
    ]);

    // Build padded 7-day array (fill missing days with 0)
    const growthMap = {};
    leadGrowthRaw.forEach((d) => { growthMap[d._id] = d.count; });
    const leadGrowth = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('fr-TN', { weekday: 'short' });
      return { date: label, leads: growthMap[key] || 0 };
    });

    const stats = {
      leads: { total: leadsCount, new: newLeadsCount, recent: recentLeads },
      messages: { total: messagesCount, recent: recentMessages },
      subscribers: { total: subscribersCount },
      projects: {
        published: publishedProjectsCount,
        draft: draftProjectsCount,
        total: publishedProjectsCount + draftProjectsCount
      },
      testimonials: { total: testimonialsCount },
      leadGrowth
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error parsing stats' });
  }
};
