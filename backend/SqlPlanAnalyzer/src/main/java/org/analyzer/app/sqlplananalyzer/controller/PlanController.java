package org.analyzer.app.sqlplananalyzer.controller;

import lombok.RequiredArgsConstructor;
import org.analyzer.app.sqlplananalyzer.dto.request.AnalyzeRequest;
import org.analyzer.app.sqlplananalyzer.service.PlanAnalyzerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanAnalyzerService planAnalyzerService;

    @PostMapping("/analyze")
    public String analyze(@RequestBody AnalyzeRequest request) {
        return planAnalyzerService.getExecutionPlan(request.sql());
    }
}
