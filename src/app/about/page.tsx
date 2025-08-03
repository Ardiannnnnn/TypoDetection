import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-poppins">
      <Navbar showBackButton={true} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">About TypoDetector</h1>
            <p className="text-xl text-gray-600 font-poppins">
              Learn more about our AI-powered typo detection technology
            </p>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600 font-poppins">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">Upload Document</h3>
                <p className="text-gray-600 font-poppins">Upload your text file through our secure interface</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600 font-poppins">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">AI Analysis</h3>
                <p className="text-gray-600 font-poppins">Our AI processes your text using advanced NLP algorithms</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600 font-poppins">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">Get Results</h3>
                <p className="text-gray-600 font-poppins">Receive detailed typo detection results with suggestions</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 font-poppins">Spelling Detection</h3>
                  <p className="text-gray-600 font-poppins">Identifies misspelled words with high accuracy</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 font-poppins">Grammar Checking</h3>
                  <p className="text-gray-600 font-poppins">Detects grammatical errors and inconsistencies</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 font-poppins">Smart Suggestions</h3>
                  <p className="text-gray-600 font-poppins">Provides intelligent correction suggestions</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 font-poppins">Context Awareness</h3>
                  <p className="text-gray-600 font-poppins">Understands context for better accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">Technology</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4 font-poppins">
                TypoDetector leverages cutting-edge Natural Language Processing (NLP) and Machine Learning 
                technologies to provide accurate typo and grammar detection. Our system is built on:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 font-poppins">
                <li>Advanced neural networks trained on millions of text samples</li>
                <li>Context-aware algorithms that understand semantic meaning</li>
                <li>Real-time processing capabilities for instant results</li>
                <li>Continuous learning from user feedback and corrections</li>
              </ul>
              <p className="font-poppins">
                Our AI model is constantly updated and improved to ensure the highest accuracy 
                rates in typo detection across various text types and writing styles.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-indigo-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 font-poppins">Ready to Try TypoDetector?</h2>
            <p className="text-indigo-100 mb-6 font-poppins">
              Upload your document now and experience the power of AI-driven typo detection
            </p>
            <Link 
              href="/upload"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 font-poppins"
            >
              Start Detection
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
