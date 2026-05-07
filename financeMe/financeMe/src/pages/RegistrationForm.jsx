import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await registerUser(formData);

    console.log("Response:", response); // ✅ correct

    if (response) {
      alert("Registration Successful!");
      navigate("/login");
    } else {
      throw new Error("No response from server");
    }

  } catch (err) {
    console.error("Register Error:", err);

    setError(
      err.message || "Registration failed"
    );
  }
};

  return (
    <div className="w-full max-w-md mx-auto mt-8 border p-10 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

      {error && (
        <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Register
        </button>

        <p className="text-center">Already have Account.</p>
        <p
          className="text-center text-blue-600 cursor-pointer underline"
          onClick={() => navigate("/login")}
        >
          Log In
        </p>

      </form>
    </div>
  );
};

export default RegisterForm;