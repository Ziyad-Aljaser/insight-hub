import React, { useState } from "react";
import { db } from "../../config/firebase";
import { SentimentStackedBarChart } from "./Charts/SentimentStackedBarChart";
import { SentimentLineChart } from "./Charts/SentimentLineChart";
import { SentimentPieCharts } from "./Charts/SentimentPieChart";
import { doc, setDoc, collection } from "firebase/firestore"; // Import Firestore functions

const VisualizationSection = ({ userID, brand, dataset, brandData }) => {
  const [visualization, setVisualization] = useState("");

  const handleVisualizationChange = (e) => {
    setVisualization(e.target.value);
  };

  // Function to handle saving the report to Firestore
  const handleSaveReport = async () => {
    // Current date and time
    const currentDate = new Date();

    // Assuming brandData is like: [[2021, 2, 3, 5], [2022, 1, 3, 7], [2023, 3, 2, 5]]
    // We transform it into an array of objects.
    const formattedBrandData = brandData.map((yearlyData) => ({
      year: yearlyData[0],
      data: yearlyData.slice(1),
    }));

    const reportData = {
      brand: brand,
      dataset: dataset,
      visualization: visualization,
      data: formattedBrandData, // using the transformed data
      dateSaved: new Date(), // Storing the current date and time
    };

    console.log("Report Data:", reportData);

    // Generate a unique ReportID or use a specific structure
    const reportID = `report_${currentDate.getTime()}`; // Using current time as part of ReportID

    // Reference to the user's reports subcollection
    const userReportsRef = collection(db, `users/${userID}/user_reports`);

    try {
      // Adding the report to Firestore
      await setDoc(doc(userReportsRef, reportID), reportData);
      console.log("Report saved successfully!");
    } catch (error) {
      console.error("Error saving the report:", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-base-300 p-5">
      <div className="card w-full glass shadow-xl p-6 mb-6">
        <div className="card-body items-center">
          <h3 className="text-2xl font-semibold p-6">
            Choose Data Visualization To Display
          </h3>
          <select
            className="select select-warning"
            onChange={handleVisualizationChange}
            value={visualization}
          >
            <option disabled value="">
              Choose Visualization
            </option>
            <option value="Stacked Bar Chart">Stacked Bar Chart</option>
            <option value="Line Chart">Line Chart</option>
            <option value="Pie Chart">Pie Chart</option>
          </select>
        </div>

        {visualization === "Stacked Bar Chart" && (
          <SentimentStackedBarChart brandName={brand} brandData={brandData} />
        )}
        {visualization === "Line Chart" && (
          <SentimentLineChart brandName={brand} brandData={brandData} />
        )}
        {visualization === "Pie Chart" && (
          <SentimentPieCharts brandName={brand} brandData={brandData} />
        )}

        {visualization && (
          <div className="flex justify-center p-2 py-10">
            <button
              className="btn btn-warning w-1/4 text-xl"
              onClick={handleSaveReport}
            >
              Save Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationSection;
