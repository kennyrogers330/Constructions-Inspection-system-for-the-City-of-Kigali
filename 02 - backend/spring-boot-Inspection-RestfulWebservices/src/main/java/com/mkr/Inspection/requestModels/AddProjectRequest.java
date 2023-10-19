package com.mkr.Inspection.requestModels;

import lombok.Data;
import java.util.Date;
@Data
public class AddProjectRequest {
    private String title;
    private String description;
    private Date start_date;
    private String location;
    private String project_type;
    private String weather_conditions;
    private int expected_duration;
    private String project_manager;
    private String contact_email;
    private String contact_phone;
    private String[] images;

}
