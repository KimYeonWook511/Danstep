package com.danstep.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
// 패키지명
//@MapperScan(value = {"com.danstep.aws.model.mapper", "com.danstep.game.model.mapper", "com.danstep.user.model.mapper"}, sqlSessionFactoryRef = "SqlSessionFactory")
@MapperScan(value = {"com.danstep.**.model.mapper"}, sqlSessionFactoryRef = "SqlSessionFactory")
public class MyBatisConfig {

    @Value("${spring.datasource.hikari.mapper-locations}")
    String mPath;

    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public DataSource DataSource() {
        return DataSourceBuilder.create().build();
    }


    @Bean(name = "SqlSessionFactory")
    public SqlSessionFactory SqlSessionFactory(@Qualifier("dataSource") DataSource DataSource, ApplicationContext applicationContext) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(DataSource);
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources(mPath));
//        sqlSessionFactoryBean.setTypeAliasesPackage("com.danstep.aws.model.dto");
//        sqlSessionFactoryBean.setTypeAliasesPackage("com.danstep.model.dto");
//        sqlSessionFactoryBean.setTypeAliasesPackage("com.danstep.model.dto, com.danstep.aws.model.dto");
        return sqlSessionFactoryBean.getObject();
    }

    @Bean(name = "SessionTemplate")
    public SqlSessionTemplate SqlSessionTemplate(@Qualifier("SqlSessionFactory") SqlSessionFactory firstSqlSessionFactory) {
        return new SqlSessionTemplate(firstSqlSessionFactory);
    }

}
