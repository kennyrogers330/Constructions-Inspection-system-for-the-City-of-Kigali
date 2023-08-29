package com.mkr.springbootlibrary.requestModels;

import lombok.Data;

import java.util.Date;
@Data
public class AddReportRequest {
    private String projectId;
    private String projectName;
    private String projectType;
    private String inspectorName;
    private String inspectorPhone;
    private String inspectorEmail;
    private Date date;
    private String[] images;
    private String excel;
}
