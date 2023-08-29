package com.mkr.springbootlibrary.requestModels;

import lombok.Data;

import java.util.Optional;

@Data
public class InspectorReviewRequest {
    private double rating;
    private Long projectId;
    private Optional<String> reviewDescription;

}
