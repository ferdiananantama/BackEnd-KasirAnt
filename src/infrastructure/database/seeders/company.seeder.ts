import { Company } from "../models/company-sequelize";

export const seedCompany = async () => {
  const defaultCompany = [
    {
      name: "Company 1",
      logoPath: "https://via.placeholder.com/150",
      address: "123 Street, New York, NY 10001",
    },
  ];

  for (const company of defaultCompany) {
    await Company.findOrCreate({
      where: { name: company.name },
      defaults: {
        name: company.name,
        logoPath: company.logoPath,
        address: company.address,
      },
    });
  }
};
