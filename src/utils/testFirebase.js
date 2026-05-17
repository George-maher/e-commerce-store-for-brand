// Firebase testing utility to verify connection and permissions
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc } from 'firebase/firestore';

/**
 * Test Firebase connection and permissions
 */
export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No authenticated user found');
      return { success: false, error: 'User not authenticated' };
    }
    
    console.log('✅ User authenticated:', user.email);
    
    // Test write permission with a test document
    const testData = {
      test: true,
      timestamp: serverTimestamp(),
      createdBy: user.email
    };
    
    console.log('🔄 Testing write permission...');
    const docRef = await addDoc(collection(db, 'products'), testData);
    console.log('✅ Write permission OK, test document ID:', docRef.id);
    
    // Test read permission
    console.log('🔄 Testing read permission...');
    const q = query(collection(db, 'products'), where('test', '==', true));
    const querySnapshot = await getDocs(q);
    console.log('✅ Read permission OK, found', querySnapshot.size, 'test documents');
    
    // Clean up test documents
    console.log('🧹 Cleaning up test documents...');
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    console.log('✅ Test documents cleaned up');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test Cloudinary upload
 */
export const testCloudinaryUpload = async () => {
  console.log('🧪 Testing Cloudinary upload...');
  
  try {
    // Create a small test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1, 1);
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    // Create file from blob
    const file = new File([blob], 'test.png', { type: 'image/png' });
    
    // Upload to Cloudinary
    const { uploadToCloudinary } = await import('./cloudinary.js');
    const result = await uploadToCloudinary(file);
    
    if (result && result.secure_url) {
      console.log('✅ Cloudinary upload test successful:', result.secure_url);
      return { success: true, url: result.secure_url };
    } else {
      throw new Error('No secure URL returned from Cloudinary');
    }
  } catch (error) {
    console.error('❌ Cloudinary upload test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Starting comprehensive Firebase and Cloudinary tests...');
  
  const results = {
    firebase: null,
    cloudinary: null
  };
  
  // Test Firebase
  results.firebase = await testFirebaseConnection();
  
  // Test Cloudinary
  results.cloudinary = await testCloudinaryUpload();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('Firebase:', results.firebase.success ? '✅ PASS' : '❌ FAIL');
  if (!results.firebase.success) {
    console.log('  Error:', results.firebase.error);
  }
  
  console.log('Cloudinary:', results.cloudinary.success ? '✅ PASS' : '❌ FAIL');
  if (!results.cloudinary.success) {
    console.log('  Error:', results.cloudinary.error);
  }
  
  const allPassed = results.firebase.success && results.cloudinary.success;
  console.log('\nOverall:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return results;
};

export default {
  testFirebaseConnection,
  testCloudinaryUpload,
  runAllTests
};
