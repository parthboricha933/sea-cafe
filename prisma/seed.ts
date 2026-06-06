import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.adminToken.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menuCategory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.restaurantSetting.deleteMany()
  await prisma.admin.deleteMany()

  // Create admin user
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashPassword('bavarchi2025'),
    },
  })
  console.log('Admin user created')

  // Create default restaurant settings
  const settings = [
    { key: 'packaging_charge', value: '20', label: 'Packaging Charge' },
    { key: 'delivery_charge', value: '30', label: 'Delivery Charge' },
    { key: 'gst_percent', value: '5', label: 'GST Percentage' },
    { key: 'upi_id', value: 'ruchitpatel.8866-5@oksbi', label: 'UPI ID' },
  ]
  for (const s of settings) {
    await prisma.restaurantSetting.create({ data: s })
  }
  console.log('Restaurant settings created')

  // Create default coupon
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discount: 10,
      type: 'PERCENT',
      minOrder: 200,
      maxUses: 100,
      usedCount: 0,
      isActive: true,
    },
  })
  console.log('Default coupon created')

  // Create categories and items
  const categories = [
    {
      name: "Chinese",
      slug: "chinese",
      icon: "🥡",
      order: 1,
      items: [
        { name: "Paneer Or Mushroom Chilly", price: 220, order: 1 },
        { name: "Veg. Manchurian Or Veg. 65 Dry", price: 169, order: 2 },
        { name: "Dragon Potato", price: 169, order: 3 },
        { name: "Chinese Bhel", price: 134, order: 4 },
        { name: "Selection Of Noodles", price: 165, variantTag: "Hakka or Szechwan", order: 5 },
        { name: "Selection Of Fried Rice", price: 165, variantTag: "Vegetable or Szechwan", order: 6 },
        { name: "Tripple Combo", price: 269, order: 7 },
        { name: "Crispy Fried Babycorn", price: 189, order: 8 },
        { name: "Crispy Fried Veg", price: 189, order: 9 },
      ]
    },
    {
      name: "Paneer",
      slug: "paneer",
      icon: "🧀",
      order: 2,
      items: [
        { name: "Paneer Lababdar Or Koriyala", price: 224, order: 1 },
        { name: "Paneer Bagdadi Or Ashiyana", price: 234, order: 2 },
        { name: "Paneer Butter Masala", price: 209, order: 3 },
        { name: "Paneer Tikka Masala", price: 219, order: 4 },
        { name: "Paneer Handi / Tawa / Kadai", price: 199, order: 5 },
        { name: "Paneer Maska Makhni", price: 214, order: 6 },
        { name: "Kaju Paneer", price: 245, badge: "best-seller", order: 7 },
        { name: "Palak Or Mutter Paneer", price: 199, order: 8 },
        { name: "Cheese Butter Masala", price: 245, order: 9 },
        { name: "Paneer Bhurji", price: 245, order: 10 },
      ]
    },
    {
      name: "Sweet",
      slug: "sweet",
      icon: "🍯",
      order: 3,
      items: [
        { name: "Navratan Korma", price: 239, badge: "must-try", order: 1 },
        { name: "Cheese Angoori", price: 239, order: 2 },
        { name: "Malai Kofta", price: 229, order: 3 },
      ]
    },
    {
      name: "Vegetable's",
      slug: "vegetables",
      icon: "🥦",
      order: 4,
      items: [
        { name: "Sev Tomato", price: 139, order: 1 },
        { name: "Lasaniya Bateka", price: 169, order: 2 },
        { name: "Dum Aloo", price: 169, order: 3 },
        { name: "Aloo Tomato Rasawala", price: 169, order: 4 },
        { name: "Cabbege Mutter", price: 169, order: 5 },
        { name: "Vegetable Lababdar / Khazana", price: 205, order: 6 },
        { name: "Vegetable Shabnam / Shabnam Curry", price: 219, order: 7 },
        { name: "Cholle Peshawari", price: 189, order: 8 },
        { name: "Subz Achari / Jalfrzie", price: 199, order: 9 },
        { name: "Veg. Handi / Kadai / Tawa", price: 189, order: 10 },
        { name: "Tomato Makai Bharta", price: 189, order: 11 },
        { name: "Vegetable Koriyala", price: 204, order: 12 },
        { name: "Veg. Kolapuri / Makhanwala", price: 169, order: 13 },
        { name: "Alu Mutter / Jeera Aloo", price: 159, order: 14 },
      ]
    },
    {
      name: "Dal & Rice",
      slug: "dal-rice",
      icon: "🍚",
      order: 5,
      items: [
        { name: "Dal Fry", price: 119, order: 1 },
        { name: "Dal Tadkewali", price: 129, order: 2 },
        { name: "Steam Rice", price: 109, order: 3 },
        { name: "Jeera Rice", price: 119, order: 4 },
        { name: "Hydrabadi Biryani", price: 159, order: 5 },
        { name: "Vegetable Pulao", price: 134, order: 6 },
        { name: "Kadhi", price: 89, order: 7 },
        { name: "Dal Khichdi", price: 139, order: 8 },
        { name: "Dum Biriyani", price: 159, badge: "must-try", order: 9 },
      ]
    },
    {
      name: "Tandoor",
      slug: "tandoor",
      icon: "🫓",
      order: 6,
      items: [
        { name: "Roti (Plain Or Butter)", price: 22, order: 1 },
        { name: "Tawa Roti", price: 20, order: 2 },
        { name: "Garlic Roti", price: 45, order: 3 },
        { name: "Kulcha (Plain Or Butter)", price: 40, order: 4 },
        { name: "Cheese Or Garlic Kulcha", price: 99, order: 5 },
        { name: "Stuffed Kulcha", price: 89, order: 6 },
        { name: "Paratha (Plain Or Butter)", price: 40, order: 7 },
        { name: "Stuffed Paratha", price: 89, order: 8 },
        { name: "Tawa Paratha", price: 35, order: 9 },
        { name: "Nan (Plain Or Butter)", price: 40, order: 10 },
        { name: "Cheese Or Garlic Nan", price: 99, order: 11 },
        { name: "Stuffed Nan", price: 89, order: 12 },
        { name: "Cheese Chilly Nan", price: 109, order: 13 },
        { name: "Cheese Garlic Nan", price: 109, badge: "best-seller", order: 14 },
      ]
    },
    {
      name: "Fix Meal",
      slug: "fix-meal",
      icon: "🍽️",
      order: 7,
      items: [
        { name: "Gujarati Thali", price: 149, description: "One Veg. Kathol Dal, Rice, Butter Milk, Papad, Four Chapathi", order: 1 },
        { name: "Punjabi Thali", price: 219, description: "One Paneer, One Veg., Dal, Rice, Papad, Butter Milk, Two Tand. Roti, Ice Cream", order: 2 },
        { name: "Spl. Gujarati Thali", price: 179, badge: "signature", description: "Farsan, One Veg. Kathol Dal, Rice, Butter Milk, Papad, Four Chapathi, Ice Cream", order: 3 },
        { name: "Spl. Punjabi Thali", price: 249, badge: "signature", description: "Soup, One Paneer, One Veg., Dal, Rice, Papad, Butter Milk, Two Tand. Roti, Ice Cream", order: 4 },
      ]
    },
    {
      name: "Dessert",
      slug: "dessert",
      icon: "🍨",
      order: 8,
      items: [
        { name: "Flavored Ice Cream", price: 39, variantTag: "Vanilla, Strawberry", order: 1 },
        { name: "Chocolate Ice Cream", price: 49, order: 2 },
        { name: "Mango Ice Cream", price: 49, order: 3 },
        { name: "Kesar Pista Ice Cream", price: 55, order: 4 },
        { name: "Butter Scotch Ice Cream", price: 55, order: 5 },
        { name: "J.K Special Ice Cream", price: 144, badge: "signature", order: 6 },
        { name: "Gulab Jamoon", price: 49, order: 7 },
        { name: "Milk Shake", price: 99, order: 8 },
        { name: "Milk Shake With Ice Cream", price: 129, order: 9 },
        { name: "Cold Coffee", price: 89, order: 10 },
        { name: "Cold Coffee With Ice Cream", price: 109, order: 11 },
      ]
    },
  ]

  for (const cat of categories) {
    const category = await prisma.menuCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        order: cat.order,
      },
    })

    for (const item of cat.items) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          badge: item.badge || null,
          variantTag: item.variantTag || null,
          description: item.description || null,
          categoryId: category.id,
          order: item.order,
        },
      })
    }

    console.log(`Created category: ${cat.name} with ${cat.items.length} items`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
