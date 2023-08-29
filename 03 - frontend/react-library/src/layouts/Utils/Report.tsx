import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import FormDataModel from './FormDataModel';

interface ModelAttributes {
  attribute1: string; 
  inspectionDate: string;
  projectId: string;
  projectName: string; 
  projectType: string;
  inspectorName: string;
  PhoneNumber: string;
  PavementCondition: string;
  RoadMarkings: string;
  RoadsideVegetation: string;
  DrainageSystem: string;
  CracksandPotholes: string;
  SurfaceSmoothness: string;
  Rutting: string;
  EdgeCondition: string;
  ExcavationCompletion: string;
  FoundationStability: string;
  MaterialQuality: string;
  EquipmentUtilization: string;
  WorkforceProductivity: string;
  WaterSupply: string;
  BedRocks: string;
  ClimateFavorability: string;
  reviewDescription: string;
  // Add other attributes here
}
export const Report: React.FC = () => {

  const location = useLocation();
  const { modelAttributes } = location.state as { modelAttributes: ModelAttributes };
  const percentageProgress = modelAttributes.attribute1;

  const dateString = modelAttributes.inspectionDate;
  const originalDate = new Date(dateString);

  const day = originalDate.getDate();
  const month = originalDate.toLocaleString('default', { month: 'short' });
  const year = originalDate.getFullYear();

  const formattedDate = `${day}, ${month} ${year}`;

  console.log(modelAttributes);

  const generatePDF = async () => {
    const reportContainer = document.querySelector('.report-container') as HTMLElement;
  
    if (reportContainer) {
      const canvas = await html2canvas(reportContainer);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('report.pdf');
    }
  };

  useEffect(() => {
    // This code will run after the component has rendered
    generatePDF();
  }, []);
  
  return (
    <div className="report-container">
      <div className="container">
        <center className='mt-3'><h1>Roads and Utilites Inspection Report</h1></center>
        <div className="row mt-5">
          <div className="col-sm">
            <img src={require('./../../Images/PublicImages/City of Kigali.png')} alt="Logo" className="logo" />
          </div>
          <div className="col-sm">
            <span  style={{ fontSize: '20px' }}><b>Project Name : </b>{modelAttributes.projectName}<br/>
            <b>Inspection Date : </b>{formattedDate}<br/>
            <b>Project ID : </b>{modelAttributes.projectId}<br/>
            <b>Project Type : </b>{modelAttributes.projectType}<br/>
            </span>
          </div>
          <div className="col-sm">
            
            <span  style={{ fontSize: '20px' }}>
            <b>Inspector Name : </b>{modelAttributes.inspectorName}<br/>
            <b>Phone Number : </b>{modelAttributes.PhoneNumber}<br/>  
            <b>Progress : </b>{percentageProgress} %<br/>        
            <b>Comment: </b> {modelAttributes.reviewDescription}
            </span>
          </div>
        </div>
        {/* <button onClick={generatePDF}>Generate PDF</button> */}
      </div>
    
      {/* <p>Inspection Date: {inspectionDate}</p>
      <p>Project Id: {projectId}</p>
      <p>Project Name: {projectName}</p> */}
      
      {/* Other report content */}
      
    </div>
  );
};