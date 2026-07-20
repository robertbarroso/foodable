export async function searchProducts(searchTerm) {
  console.log("Searching for:", searchTerm);

  return [
    {
      id: 1,
      name: "Downtown Farmers Market",
      address: "123 Main Street",
      city: "Oakland, CA",
    },
    {
      id: 2,
      name: "West Oakland Produce",
      address: "456 Market Street",
      city: "Oakland, CA",
    },
  ];
}