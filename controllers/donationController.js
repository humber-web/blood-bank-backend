const { Donation, Donor, BloodStock } = require('../models');

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      include: [{ model: Donor }]
    });
    res.json(donations);
  } catch (error) {
    console.error('Get All Donations Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const createDonation = async (req, res) => {
  const { donor_id, blood_group, volume_ml, donation_date } = req.body;

  try {
    const donation = await Donation.create({
      donor_id,
      blood_group,
      volume_ml,
      donation_date
    });

    // Automatically create BloodStock entry
    const expiry_date = new Date(donation_date);
    expiry_date.setDate(expiry_date.getDate() + 42); // Assuming 42 days expiry

    await BloodStock.create({
      donation_id: donation.id,
      blood_group,
      volume_ml,
      expiry_date
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error('Create Donation Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getDonationById = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findByPk(id, {
      include: [{ model: Donor }, { model: BloodStock }]
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get Donation By ID Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateDonation = async (req, res) => {
  const { id } = req.params;
  const { blood_group, volume_ml, donation_date } = req.body;

  try {
    const donation = await Donation.findByPk(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    donation.blood_group = blood_group || donation.blood_group;
    donation.volume_ml = volume_ml || donation.volume_ml;
    donation.donation_date = donation_date || donation.donation_date;

    await donation.save();

    // Update associated BloodStock
    const bloodStock = await BloodStock.findOne({
      where: { donation_id: donation.id }
    });

    if (bloodStock) {
      bloodStock.blood_group = blood_group || bloodStock.blood_group;
      bloodStock.volume_ml = volume_ml || bloodStock.volume_ml;
      if (donation_date) {
        bloodStock.expiry_date = new Date(donation_date);
        bloodStock.expiry_date.setDate(bloodStock.expiry_date.getDate() + 42);
      }
      await bloodStock.save();
    }

    res.json(donation);
  } catch (error) {
    console.error('Update Donation Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findByPk(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    await BloodStock.destroy({ where: { donation_id: donation.id } });
    await donation.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Delete Donation Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllDonations,
  createDonation,
  getDonationById,
  updateDonation,
  deleteDonation
};
