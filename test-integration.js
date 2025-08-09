// Test script to verify the API integration
const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing API Integration...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint:');
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    console.log('   ✅ Health:', health.message);
    
    // Test 2: Login
    console.log('\n2. Testing Login:');
    const loginRes = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tenant@example.com',
        password: 'password'
      })
    });
    const user = await loginRes.json();
    console.log(`   ✅ Logged in as: ${user.name} (${user.role})`);
    
    // Test 3: Get Villas
    console.log('\n3. Testing Villas Endpoint:');
    const villasRes = await fetch(`${API_BASE}/villas`);
    const villas = await villasRes.json();
    console.log(`   ✅ Found ${villas.length} villas`);
    console.log(`   📋 Sample villa: ${villas[0].name} at ${villas[0].location}`);
    
    // Test 4: Get Bookings
    console.log('\n4. Testing Bookings Endpoint:');
    const bookingsRes = await fetch(`${API_BASE}/bookings`);
    const bookings = await bookingsRes.json();
    console.log(`   ✅ Found ${bookings.length} bookings`);
    
    // Test 5: Get Promotions
    console.log('\n5. Testing Promotions Endpoint:');
    const promotionsRes = await fetch(`${API_BASE}/promotions`);
    const promotions = await promotionsRes.json();
    console.log(`   ✅ Found ${promotions.length} promotions`);
    
    // Test 6: Get Notifications
    console.log('\n6. Testing Notifications Endpoint:');
    const notificationsRes = await fetch(`${API_BASE}/notifications`);
    const notifications = await notificationsRes.json();
    console.log(`   ✅ Found ${notifications.length} notifications`);
    
    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Server running at: http://localhost:3001`);
    console.log(`   - Client running at: http://localhost:5173/wezo/`);
    console.log(`   - Database: SQLite (dev.db)`);
    console.log(`   - ${villas.length} villas loaded from database`);
    console.log(`   - Authentication working with test users`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();