const { Quotation, Ad } = require('../models');

// @desc    Get all quotations with ad details
// @route   GET /api/quotations
// @access  Private
exports.getQuotations = async (req, res) => {
  try {
    // We want all ads and their quotations (LEFT JOIN equivalent)
    const ads = await Ad.findAll({
      include: [{
        model: Quotation,
        required: false // LEFT JOIN
      }],
      order: [['created_at', 'DESC']]
    });

    const formattedData = ads.map(ad => {
      // Flatten data to match what the frontend expects
      const adJson = ad.toJSON();
      // An ad could have multiple quotes, but for this ledger we usually take the first one or map them.
      // Assuming a 1-to-1 for the ledger view in this specific query logic
      const quotation = adJson.Quotations && adJson.Quotations.length > 0 ? adJson.Quotations[0] : {};
      
      return {
        ad_id: adJson.id,
        ad_title: adJson.title,
        ad_client: adJson.client,
        ad_budget: adJson.budget,
        ad_status: adJson.status,
        ad_impressions: adJson.impressions,
        video_url: adJson.video_url,
        id: quotation.id || null,
        amount: quotation.amount || null,
        status: quotation.status || null,
        created_at: quotation.created_at || null,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a quotation for an ad
// @route   POST /api/quotations
// @access  Private
exports.createQuotation = async (req, res) => {
  const { ad_id, amount, notes } = req.body;

  try {
    const quotation = await Quotation.create({
      ad_id,
      amount,
      notes,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: quotation,
      message: 'Quotation created successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

