package org.analyzer.app.sqlplananalyzer.dto.request;

public record AnalyzeRequest(
        String sql,
        String host,
        int port,
        String database,
        String username,
        String password
) {}