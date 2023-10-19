package com.mkr.Inspection.requestModels;

import lombok.Data;

import java.util.Optional;

@Data
public class InspectorReviewRequest {
    private double rating;
    private Long projectId;
//    private Double percentageProgress;
    private Optional<String> reviewDescription;

}
