package com.mkr.springbootlibrary.Entity;

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

    private String excel_report;

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
