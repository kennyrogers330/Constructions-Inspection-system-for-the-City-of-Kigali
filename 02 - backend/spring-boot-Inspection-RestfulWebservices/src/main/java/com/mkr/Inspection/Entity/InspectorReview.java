package com.mkr.Inspection.Entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="inspectorReview")
@Data
public class InspectorReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @CreationTimestamp
    @Column(name = "date")
    private Date date;

    @Column(name = "rating")
    private double rating;

    @Column(name = "review_description")
    private String reviewDescription;

    @ManyToOne(cascade= {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinColumn(name="project_Id")
    private Project  project;
}
