package com.mkr.Inspection.Entity;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "project")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "project_manager")
    private String project_manager;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private Date start_date;

    @Column(name = "location")
    private String location;

    @Column(name = "project_type")
    private String project_type;

    @Column(name = "weather_conditions")
    private String weather_conditions;

    @Column(name = "expected_duration")
    private int expected_duration;

    @Column(name = "contact_email")
    private String contact_email;

    @Column(name = "contact_phone")
    private String contact_phone;

    @OneToMany(fetch=FetchType.LAZY, mappedBy="project",
            cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
                    CascadeType.REFRESH})
    private List<Image> images;

    @OneToMany(fetch=FetchType.LAZY, mappedBy="project",
            cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
                    CascadeType.REFRESH})
    private List<InspectorReview> inspectorReviews;

    @OneToMany(fetch=FetchType.LAZY, mappedBy="project",
            cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
                    CascadeType.REFRESH})
    private List<Report> reports;

    public void add(Image tempImage)
    {
        if(images == null)
        {
            images = new ArrayList<>();
        }

        images.add(tempImage);
        tempImage.setProject(this);
    }

    public void addReview(InspectorReview review)
    {
        if(inspectorReviews == null)
        {
            inspectorReviews = new ArrayList<>();
        }

        inspectorReviews.add(review);
        review.setProject(this);
    }

    public void addReport(Report report)
    {
        if(reports == null)
        {
            reports = new ArrayList<>();
        }

        reports.add(report);
        report.setProject(this);
    }
}
