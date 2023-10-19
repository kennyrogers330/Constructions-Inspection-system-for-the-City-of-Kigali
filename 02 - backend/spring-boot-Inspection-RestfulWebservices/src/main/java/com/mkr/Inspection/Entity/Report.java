package com.mkr.Inspection.Entity;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "report")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "projectName")
    private String projectName;

    @Column(name = "project_type")
    private String project_type;

    @Column(name = "Inspection_date")
    private Date date;

    @Column(name = "inspectorName")
    private String inspectorName;

    @Column(name = "PhoneNumber")
    private String PhoneNumber;

    private String excel_report;

    @Column(name = "comment")
    private String comment;

    @Column(name = "phase")
    private Long phase;

    @Column(name = "progress")
    private Double progress;

    @ManyToOne(cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinColumn(name="project_Id")
    private Project  project;

    @OneToMany(fetch=FetchType.LAZY, mappedBy="report",
            cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
                    CascadeType.REFRESH})
    private List<Image> images;

    public void add(Image tempImage)
    {
        if(images == null)
        {
            images = new ArrayList<>();
        }

        images.add(tempImage);
        tempImage.setReport(this);
    }

}
