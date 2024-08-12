package com.danstep.rank.model.mapper;

import com.danstep.rank.model.dto.SaveRankDTO;
import com.danstep.result.model.dto.SaveResultDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RankMapper {

    Integer getUserHighScore(SaveResultDTO saveResultDTO);

    void insertRankInfo(Integer resultInfoId);

    void updateRankInfo(SaveRankDTO saveRankDTO);
}
