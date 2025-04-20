import React, { useRef, useState } from "react";
import { supabase } from '../utils/supabaseClient';

const Home = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyWebsite: "",
    role: "",
    contactNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      companyWebsite: formData.companyWebsite,
      role: formData.role,
      contactNumber: formData.contactNumber,
    };
  
    try {
      // Save to Supabase table
      const { error: insertError } = await supabase.from("GLNT LANDING LEADS").insert([payload]);
  
      if (insertError) {
        console.error("Error saving to database:", insertError.message);
        alert("There was an issue submitting your form. Please try again.");
        return;
      }
  
      // Call the edge function via supabase.functions.invoke
      const { data, error: functionError } = await supabase.functions.invoke('send-glnt-lead-email', {
        body: {
          to: 'meetbrij@gmail.com',
          subject: 'New Lead from GLNT Landing Page',
          html: `
            <h2>New Lead Details</h2>
            <p><strong>Full Name:</strong> ${payload.fullName}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Company Website:</strong> ${payload.companyWebsite}</p>
            <p><strong>Role:</strong> ${payload.role || "N/A"}</p>
            <p><strong>Contact Number:</strong> ${payload.contactNumber || "N/A"}</p>
          `,
        },
      });
  
      if (functionError) {
        console.error("Email function error:", functionError.message);
        alert("Form submitted but email failed to send.");
      }
  
      // Show success message
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong. Please try again.");
    }
  };  

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white h-[70vh] flex items-center justify-center px-8"
        style={{ backgroundImage: "url('/background-dark.jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-0" />
        <div className="relative z-10 text-center max-w-3xl">
          <p className="text-sm uppercase tracking-wide mb-4">Market Intelligence for Fintech</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Stay Updated, Stay Ahead</h1>
          <p className="text-lg md:text-xl mb-20">
            The ultimate news companion for fintech sales and marketing professionals
          </p>
          <button
            onClick={scrollToForm}
            className="bg-sky-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-bold"
          >
            Register Interest
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose GLNT Asia?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Tailored for Fintech Sales</h3>
            <p>
              Our platform is purpose-built for technology vendors in Asia’s financial services sector, offering deep insights that align with your sales strategy.
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Actionable Market Intelligence</h3>
            <p>
              From executive movements to tech adoption and partnerships, our updates help you make smarter, faster business decisions.
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Always Stay Ahead</h3>
            <p>
              Get timely alerts and summaries so you can engage your prospects with relevance and confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-white px-6" ref={formRef}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <img 
              src="/background-image-3.jpeg" 
              alt="Sign Up Visual" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2">
            {submitted ? (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                <p className="text-lg">
                  We've received your interest and will get back to you soon. Thank you for signing up!
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">Sign Up for Early Access</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="fullName" placeholder="Full Name*" required onChange={handleChange} className="w-full p-2 border rounded" />
                  <input type="email" name="email" placeholder="Email*" required onChange={handleChange} className="w-full p-2 border rounded" />
                  <input type="text" name="companyWebsite" placeholder="Company Website*" required onChange={handleChange} className="w-full p-2 border rounded" />
                  <input type="text" name="role" placeholder="Your Role" onChange={handleChange} className="w-full p-2 border rounded" />
                  <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="w-full p-2 border rounded" />
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;