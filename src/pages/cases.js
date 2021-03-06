import React from "react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/templates/SEO"
import Layout from "@components/templates/Layout"
import Typography from "@material-ui/core/Typography"
import { graphql } from "gatsby"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import styled from "styled-components"
import { Row } from "@components/atoms/Row"
import { Label } from "@components/atoms/Text"
import { withLanguage } from "../utils/i18n"

const WarsCaseContainer = styled(Box)`
  background: ${props => props.theme.palette.background.paper};
  padding: 8px 16px;
  margin: 16px 0;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`

const WarsCaseContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`

const WarsCaseDetail = styled(Typography)`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.33rem;
`

const WarsSource = styled(Link)`
  margin-top: 8px;
`

const confirmedCases = (i18n, item, t) => {
  const { node } = item
  return (
    <WarsCaseContainer key={`case-${node.case_no}`}>
      <Row>
        <Box>
          {`#${node.case_no}`} ({withLanguage(i18n, node, "type")})
        </Box>
        <Box>{withLanguage(i18n, node, "status")}</Box>
      </Row>
      <Row>
        <Box>{`${t("dashboard.patient_age_format", { age: node.age })}  ${t(
          `dashboard.gender_${node.gender}`
        )}`}</Box>
      </Row>
      <Box>
        <WarsCaseContent>
          <Box>
            <Label>{t("dashboard.patient_confirm_date")}</Label>
            {node.confirmation_date}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_citizenship")}</Label>
            {withLanguage(i18n, node, "citizenship") || "-"}
          </Box>
          <Box>
            <Label>{t("dashboard.patient_hospital")}</Label>
            {withLanguage(i18n, node, "hospital") || "-"}
          </Box>
        </WarsCaseContent>
      </Box>
      <Row>
        <WarsCaseDetail>{withLanguage(i18n, node, "detail")}</WarsCaseDetail>
      </Row>
      <Row>
        <WarsSource href={node.source_url} target="_blank">
          {t("dashboard.source")}
        </WarsSource>
      </Row>
    </WarsCaseContainer>
  )
}

const ConfirmedCasePage = props => {
  const { data } = props
  const { i18n, t } = useTranslation()

  data.allWarsCase.edges.sort(
    (a, b) => parseInt(b.node.case_no) - parseInt(a.node.case_no)
  )

  return (
    <Layout>
      <SEO title="ConfirmedCasePage" />
      <Typography variant="h4">{t("cases.title")}</Typography>
      {data.allWarsCase.edges.map(node => confirmedCases(i18n, node, t))}
    </Layout>
  )
}

export default ConfirmedCasePage

export const ConfirmedCaseQuery = graphql`
  query {
    allWarsCase(
      sort: { order: DESC, fields: case_no }
      filter: { enabled: { eq: "Y" } }
    ) {
      edges {
        node {
          case_no
          confirmation_date
          gender
          age
          hospital_zh
          hospital_en
          status_zh
          status_en
          type_zh
          type_en
          citizenship_zh
          citizenship_en
          detail_zh
          detail_en
          source_url
        }
      }
    }
  }
`
